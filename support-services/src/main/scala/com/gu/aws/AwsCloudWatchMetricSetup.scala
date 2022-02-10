package com.gu.aws

import com.gu.aws.AwsCloudWatchMetricPut._
import com.gu.support.config.{Stage, TouchPointEnvironment}
import com.gu.support.workers.{PaymentProvider, ProductType}

object AwsCloudWatchMetricSetup {
  def setupWarningRequest(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("WarningCount"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def catalogFailureRequest(environment: TouchPointEnvironment): MetricRequest =
    getMetricRequest(
      MetricName("CatalogLoadingFailure"),
      Map(
        MetricDimensionName("Environment") -> MetricDimensionValue(environment.envValue),
      ),
    )

  def revenueDistributionFailureRequest(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("RevenueDistributionFailure"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def paymentSuccessRequest(
      stage: Stage,
      isTestUser: Boolean,
      paymentProvider: PaymentProvider,
      productType: ProductType,
  ): MetricRequest = {
    val qualifiedStage = stage.toString + (if (isTestUser) "-UAT" else "")
    getMetricRequest(
      MetricName("PaymentSuccess"),
      Map(
        MetricDimensionName("PaymentProvider") -> MetricDimensionValue(paymentProvider.name),
        MetricDimensionName("ProductType") -> MetricDimensionValue(productType.toString),
        MetricDimensionName("Stage") -> MetricDimensionValue(qualifiedStage),
      ),
    )
  }

  def createSetupIntentRequest(stage: Stage, mode: String): MetricRequest =
    getMetricRequest(
      MetricName("CreateSetupIntent"),
      Map(
        MetricDimensionName("Mode") -> MetricDimensionValue(mode),
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def serverSideCreateFailure(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("ServerSideCreateFailure"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  private def getMetricRequest(
      name: MetricName,
      dimensions: Map[MetricDimensionName, MetricDimensionValue],
  ): MetricRequest =
    MetricRequest(
      MetricNamespace(s"support-frontend"),
      name,
      dimensions,
    )
}
