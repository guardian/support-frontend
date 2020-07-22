package com.gu

import java.io.File
import java.nio.file.{CopyOption, Files, StandardCopyOption}

import com.amazonaws.services.s3.model.GetObjectRequest
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricPut.{MetricDimensionName, MetricDimensionValue, MetricName, MetricNamespace, MetricRequest}
import com.gu.support.catalog.AwsS3Client
import org.scalatest.Reporter
import org.scalatest.events.{Event, RunAborted, RunCompleted, TestFailed, TestSucceeded}
import org.scalatest.tools.Runner

import scala.collection.JavaConverters._
import scala.util.{Failure, Success, Try}
class RunITTests {
  // Referenced in Cloudformation
  def apply(): String = RunITTests.apply()
}
object RunITTests {

  lazy val stage = System.getenv().asScala.toMap.getOrElse("Stage", "DEV")
  // todo should we also check the build id to make sure support-workers deploy is keeping the remote jar in sync?

  def main(args: Array[String]): Unit = {
    apply()
  }

  val tempJar = "/tmp/support-workers-it.jar"

  def apply(): String = {
    val exists = new File(tempJar).exists()
    val result = for {
      _ <- if (exists) Success(()) else {
        val bucket = "support-workers-dist"
        val s3File = s"support/${stage}/it-tests/support-workers-it.jar"
        println(s"getting s3 file: $bucket / $s3File")
        val catalog = new GetObjectRequest(bucket, s3File)
        fetchJson(catalog)
      }
      a = Array(
        "-R", tempJar,
        "-e",
        "-q", "Spec",//otherwise we get an out of memory metaspace error - the jar is way too big
        "-C", "com.gu.ITTestReporter"
      )
      _ <- Try(Runner.main(a)) // unfortunately calls System.exit(1) if any tests fail...
    } yield ()
    result match {
      case Failure(exception) => println(s"Failed with exception ${exception.toString}")
        exception.printStackTrace(System.out)
        System.exit(9)
        "not possible"
      case _ => println("RAN OK!")
        "Finshed and RAN OK!"
    }
//    val jarLoc = "support-workers/target/scala-2.12/support-workers-it.jar"
  }

  def fetchJson(request: GetObjectRequest): Try[Unit] =
    for {
      s3Stream <- AwsS3Client.fetchObject(AwsS3Client.s3, request)
      _ <- Try(Files.copy(s3Stream, new File(tempJar).toPath))
      _ <- Try(s3Stream.close())
    } yield ()

}

class ITTestReporter extends Reporter {

  private def putMetric(metricName: MetricName, value: Double) = AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(
    MetricRequest(
      MetricNamespace("support-frontend"),
      metricName,
      Map(MetricDimensionName("Stage") -> MetricDimensionValue(RunITTests.stage)),
      value
    )
  )

  override def apply(event: Event): Unit = {
    event match {
      case _: TestFailed =>
        println(s"TEST FAILED - sending metric: $event")
        putMetric(MetricName("it-test-failed"), 1.0)
      case _: RunAborted =>
        println(s"RUN ABORTED - sending metric: $event")
        putMetric(MetricName("it-test-failed"), 999999.0)
      case runCompleted: RunCompleted =>
        println(s"RUN COMPLETED - sending metric: $event")
        putMetric(MetricName("it-test-succeeded"), runCompleted.summary.map(_.testsSucceededCount.toDouble).getOrElse(0.0))
      case _ =>
        println(s"event: $event")
    }
  }
}
