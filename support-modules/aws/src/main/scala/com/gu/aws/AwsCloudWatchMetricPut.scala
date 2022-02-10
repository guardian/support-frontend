package com.gu.aws

import com.amazonaws.regions.Regions
import com.amazonaws.services.cloudwatch.model.{Dimension, MetricDatum, PutMetricDataRequest, StandardUnit}
import com.amazonaws.services.cloudwatch.{AmazonCloudWatch, AmazonCloudWatchClientBuilder}

import scala.util.Try

object AwsCloudWatchMetricPut {
  val client: AmazonCloudWatch =
    AmazonCloudWatchClientBuilder
      .standard()
      .withRegion(Regions.EU_WEST_1)
      .withCredentials(CredentialsProvider)
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

  def apply(client: AmazonCloudWatch)(request: MetricRequest): Try[Unit] = {

    val putMetricDataRequest = new PutMetricDataRequest
    putMetricDataRequest.setNamespace(request.namespace.value)

    val metricDatum1 = request.dimensions.foldLeft(
      new MetricDatum()
        .withMetricName(request.name.value),
    ) { case (agg, (name, value)) =>
      agg.withDimensions(
        new Dimension()
          .withName(name.value)
          .withValue(value.value),
      )
    }
    metricDatum1.setValue(request.value)
    metricDatum1.setUnit(StandardUnit.Count)
    putMetricDataRequest.getMetricData.add(metricDatum1)
    Try(client.putMetricData(putMetricDataRequest)).map(_ => ())
  }

}
