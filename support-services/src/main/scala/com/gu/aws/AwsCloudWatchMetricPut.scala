package com.gu.aws

import com.amazonaws.regions.Regions
import com.amazonaws.services.cloudwatch.model.{Dimension, MetricDatum, PutMetricDataRequest, StandardUnit}
import com.amazonaws.services.cloudwatch.{AmazonCloudWatch, AmazonCloudWatchClientBuilder}
import com.gu.support.config.{Stage, TouchPointEnvironment}
import com.gu.support.workers.ProductType
import ophan.thrift.event.PaymentProvider

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
      dimensions: Map[MetricDimensionName, MetricDimensionValue]
  )

  def apply(client: AmazonCloudWatch)(request: MetricRequest): Try[Unit] = {

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
    Try(client.putMetricData(putMetricDataRequest)).map(_ => Unit)
  }

  def setupWarningRequest(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("WarningCount"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString)
      ))

  def catalogFailureRequest(environment: TouchPointEnvironment): MetricRequest =
    getMetricRequest(MetricName("CatalogLoadingFailure"),
      Map(
        MetricDimensionName("Environment") -> MetricDimensionValue(environment.toString)
      ))

  def paymentSuccessRequest(stage: Stage, paymentProvider: Option[PaymentProvider], productType: ProductType): MetricRequest =
    getMetricRequest(
      MetricName("PaymentSuccess"),
      Map(
        MetricDimensionName("PaymentProvider") -> MetricDimensionValue(paymentProvider.map(_.name).getOrElse("None")),
        MetricDimensionName("ProductType") -> MetricDimensionValue(productType.toString),
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString)
      )
    )

  def createSetupIntentRequest(stage: Stage, mode: String): MetricRequest =
    getMetricRequest(
      MetricName("CreateSetupIntent"),
      Map(
        MetricDimensionName("Mode") -> MetricDimensionValue(mode),
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString)
      )
    )

  private def getMetricRequest(name: MetricName, dimensions: Map[MetricDimensionName, MetricDimensionValue]) : MetricRequest =
    MetricRequest(
      MetricNamespace(s"support-frontend"),
      name,
      dimensions
    )
}
