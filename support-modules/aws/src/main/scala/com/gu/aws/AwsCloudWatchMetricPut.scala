package com.gu.aws

import com.typesafe.scalalogging.LazyLogging
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.cloudwatch.CloudWatchClient
import software.amazon.awssdk.services.cloudwatch.model.{Dimension, MetricDatum, PutMetricDataRequest, StandardUnit}

import scala.jdk.CollectionConverters._
import scala.util.{Failure, Success, Try}

object AwsCloudWatchMetricPut extends LazyLogging {
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
    logger.info("Logging metric: " + request)

    val javaDimensions = request.dimensions
      .map { case (name, value) =>
        Dimension
          .builder()
          .name(name.value)
          .value(value.value)
          .build()
      }
      .toSeq
      .asJava

    val metricDatum1 =
      MetricDatum
        .builder()
        .metricName(request.name.value)
        .dimensions(javaDimensions)
        .value(request.value)
        .unit(StandardUnit.COUNT)
        .build()

    val putMetricDataRequest = PutMetricDataRequest
      .builder()
      .namespace(request.namespace.value)
      .metricData(metricDatum1)
      .build()

    val attempt = Try(client.putMetricData(putMetricDataRequest))
    attempt match {
      case Failure(exception) => logger.error("metric send failed with " + exception.toString)
      case Success(value) => logger.info("metric sent successfully: " + value)
    }
    attempt.map(_ => ())
  }

}
