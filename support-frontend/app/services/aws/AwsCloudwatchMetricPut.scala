package services.aws

import com.amazonaws.regions.Regions
import com.amazonaws.services.cloudwatch.model._
import com.amazonaws.services.cloudwatch.{AmazonCloudWatch, AmazonCloudWatchClientBuilder}
import com.gu.support.config.Stage
import services.aws

import scala.util.Try

object AwsCloudwatchMetricPut {
  val cloudWatchEffect: AmazonCloudWatch =
    AmazonCloudWatchClientBuilder
      .standard()
      .withRegion(Regions.EU_WEST_1)
      .withCredentials(aws.CredentialsProvider)
      .build()

  case class MetricNamespace(value: String) extends AnyVal
  case class MetricName(value: String) extends AnyVal
  case class MetricDimensionName(value: String) extends AnyVal
  case class MetricDimensionValue(value: String) extends AnyVal

  case class MetricRequest(
      namespace: MetricNamespace,
      name: MetricName,
      dimensions: Map[MetricDimensionName, MetricDimensionValue]
  )

  def apply(s3Client: AmazonCloudWatch)(request: MetricRequest): Try[Unit] = {

    val putMetricDataRequest = new PutMetricDataRequest
    putMetricDataRequest.setNamespace(request.namespace.value)

    val metricDatum1 = request.dimensions.foldLeft(
      new MetricDatum()
        .withMetricName(request.name.value)
    ) {
        case (agg, (name, value)) =>
          agg.withDimensions(
            new Dimension()
              .withName(name.value)
              .withValue(value.value)
          )
      }
    metricDatum1.setValue(1.00)
    metricDatum1.setUnit(StandardUnit.Count)
    putMetricDataRequest.getMetricData.add(metricDatum1)
    Try(s3Client.putMetricData(putMetricDataRequest)).map(_ => ())
  }

  def setupWarningRequest(stage: Stage): MetricRequest = {
    MetricRequest(
      MetricNamespace(s"support-frontend"),
      MetricName("WarningCount"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString)
      )
    )
  }

}
