package com.gu

import java.io.{File, InputStream, OutputStream}
import java.nio.file.Files

import com.amazonaws.services.lambda.runtime.{Context, RequestStreamHandler}
import com.amazonaws.services.s3.AmazonS3URI
import com.gu.aws.AwsCloudWatchMetricPut._
import com.gu.aws.{AwsCloudWatchMetricPut, AwsS3Client}
import org.scalatest.Reporter
import org.scalatest.events.{Event, RunAborted, RunCompleted, TestFailed}
import org.scalatest.tools.Runner

import scala.jdk.CollectionConverters._
import scala.util.{Failure, Success, Try}
class RunITTests extends RequestStreamHandler {

  // Referenced in Cloudformation
  override def handleRequest(input: InputStream, output: OutputStream, context: Context): Unit =
    RunITTests.apply(context.getLogger.log(_: String))

}
object RunITTests {

  lazy val stage = System.getenv().asScala.toMap.getOrElse("Stage", "DEV")
  // todo should we also check the build id to make sure support-workers deploy is keeping the remote jar in sync?

  def main(args: Array[String]): Unit = {
    apply(println)
  }
  var logger: String => Unit = null

  val tempJar = "/tmp/support-workers-it.jar"

  def apply(log: String => Unit): String = {
    logger = log
    val exists = new File(tempJar).exists()
    val result = for {
      _ <-
        if (exists) Success(())
        else {
          val jarUrl = s"s3://support-workers-dist/support/${stage}/it-tests/support-workers-it.jar"
          log(s"getting s3 file: $jarUrl")
          copyJar(new AmazonS3URI(jarUrl))
        }
      a = Array(
        "-R",
        tempJar,
        "-e",
        "-q",
        "Spec", // otherwise we get an out of memory metaspace error - the jar is way too big
        "-C",
        "com.gu.ITTestReporter",
      )
      _ <- Try(Runner.main(a)) // unfortunately calls System.exit(1) if any tests fail...
    } yield ()
    result match {
      case Failure(exception) =>
        log(s"Failed with exception ${exception.toString}")
        exception.printStackTrace(System.out)
        System.exit(9)
        "not possible"
      case _ =>
        log("RAN OK!")
        "Finished and RAN OK!" // this won't happen because Runner calls System.exit
    }
  }

  def copyJar(request: AmazonS3URI): Try[Unit] =
    AwsS3Client.withStream { is =>
      Try(Files.copy(is, new File(tempJar).toPath)).map(_ => ())
    }(request)

}

class ITTestReporter extends Reporter {

  private def putMetric(metricName: MetricName, value: Double) = AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(
    MetricRequest(
      MetricNamespace("support-frontend"),
      metricName,
      Map(MetricDimensionName("Stage") -> MetricDimensionValue(RunITTests.stage)),
      value,
    ),
  )

  val log = RunITTests.logger

  override def apply(event: Event): Unit = {
    event match {
      case _: TestFailed =>
        log(s"TEST FAILED - sending metric: $event")
        putMetric(MetricName("it-test-failed"), 1.0).get
      case _: RunAborted =>
        log(s"RUN ABORTED - sending metric: $event")
        putMetric(MetricName("it-test-failed"), 999999.0).get
      case runCompleted: RunCompleted =>
        log(s"RUN COMPLETED - sending metric: $event")
        putMetric(
          MetricName("it-test-succeeded"),
          runCompleted.summary.map(_.testsSucceededCount.toDouble).getOrElse(0.0),
        ).get
      case _ =>
        log(s"event: $event")
    }
  }
}
