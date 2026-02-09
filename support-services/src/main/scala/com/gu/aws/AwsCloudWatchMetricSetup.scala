package com.gu.aws

import com.gu.aws.AwsCloudWatchMetricPut._
import com.gu.support.config.Stage
import com.gu.support.workers.{PaymentProvider, ProductType}

object AwsCloudWatchMetricSetup {
  def setupWarningRequest(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("WarningCount"),
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
    val qualifiedStage = stage.toString + (if (isTestUser) "-TEST" else "")
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

  def serverSideHighThresholdCreateFailure(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("ServerSideHighThresholdCreateFailure"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def defaultPromotionsLoadingFailure(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("DefaultPromotionsLoadingFailure"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def writeAcquisitionDataToBigQueryFailure(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("WriteAcquisitionDataToBigQueryFailure"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def getDeliveryAgentsFailure(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("GetDeliveryAgentsFailure"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def stripeHostedFormFieldsHashMismatch(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("StripeHostedFormFieldsHashMismatch"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def getDeliveryAgentsSuccess(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("GetDeliveryAgentsSuccess"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def getLandingPageTestsError(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("GetLandingPageTestsError"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def getCheckoutNudgeTestsError(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("GetCheckoutNudgeTestsError"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def getOneTimeCheckoutTestsError(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("GetOneTimeCheckoutTestsError"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def getTickerDataError(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("GetTickerDataError"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString),
      ),
    )

  def getMParticleTokenError(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("MParticleTokenError"),
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
