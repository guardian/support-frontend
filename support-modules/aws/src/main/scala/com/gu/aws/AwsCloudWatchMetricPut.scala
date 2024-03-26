package com.gu.aws

import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.cloudwatch.CloudWatchClient
import software.amazon.awssdk.services.cloudwatch.model.{Dimension, MetricDatum, PutMetricDataRequest, StandardUnit}

import scala.util.Try

object AwsCloudWatchMetricPut {
  val client: CloudWatchClient =
    CloudWatchClient
      .builder()
      .region(Region.EU_WEST_1)
      .credentialsProvider(CredentialsProvider)
      .build()

  case class MetricNamespace(value: String) extends AnyVal
  case class MetricName(value: String) extends AnyVal
  case class MetricDimensionName(value: String) extends AnyVal
  case class MetricDimensionValue(value: String) extends AnyVal

  case class MetricRequest(
      namespace: MetricNamespace,
      name: MetricName,
      dimensions: Map[MetricDimensionName, MetricDimensionValue],
      value: Double = 1.0,
  )

  def apply(client: CloudWatchClient)(request: MetricRequest): Try[Unit] = {

    val metricDatum1 = request.dimensions
      .foldLeft(
        MetricDatum
          .builder()
          .metricName(request.name.value),
      ) { case (agg, (name, value)) =>
        agg.dimensions(
          Dimension
            .builder()
            .name(name.value)
            .value(value.value)
            .build(),
        )
      }
      .value(request.value)
      .unit(StandardUnit.COUNT)
      .build()

    val putMetricDataRequest = PutMetricDataRequest
      .builder()
      .namespace(request.namespace.value)
      .metricData(metricDatum1)
      .build()

    Try(client.putMetricData(putMetricDataRequest)).map(_ => ())
  }

}
