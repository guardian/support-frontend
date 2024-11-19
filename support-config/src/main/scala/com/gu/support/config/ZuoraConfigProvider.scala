package com.gu.support.config

import com.gu.support.catalog.{ProductRatePlanChargeId, ProductRatePlanId}
import com.gu.support.workers._
import com.typesafe.config.Config

case class ZuoraContributionConfig(
    productRatePlanId: ProductRatePlanId,
    productRatePlanChargeId: ProductRatePlanChargeId,
)

case class ZuoraDigitalPackConfig(
    defaultFreeTrialPeriod: Int,
    paymentGracePeriod: Int,
    monthlyChargeId: String,
    annualChargeId: String,
)

case class ZuoraGuardianLightConfig(
    paymentGracePeriod: Int,
    monthlyChargeId: String,
)

case class ZuoraSupporterPlusConfig(
    monthlyChargeId: String,
    annualChargeId: String,
    v2: V2,
)

case class V2(
    monthlyContributionChargeId: String,
    annualContributionChargeId: String,
)

case class ZuoraConfig(
    url: String,
    username: String,
    password: String,
    monthlyContribution: ZuoraContributionConfig,
    annualContribution: ZuoraContributionConfig,
    digitalPack: ZuoraDigitalPackConfig,
    supporterPlusConfig: ZuoraSupporterPlusConfig,
    guardianLight: ZuoraGuardianLightConfig,
) {

  def contributionConfig(billingPeriod: BillingPeriod): ZuoraContributionConfig =
    billingPeriod match {
      case Annual => annualContribution
      case _ => monthlyContribution
    }
}

class ZuoraConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[ZuoraConfig](config, defaultStage) {

  def fromConfig(config: Config): ZuoraConfig = ZuoraConfig(
    url = config.getString(s"zuora.api.url"),
    username = config.getString(s"zuora.api.username"),
    password = config.getString(s"zuora.api.password"),
    monthlyContribution = contributionFromConfig(config.getConfig("zuora.contribution.monthly")),
    annualContribution = contributionFromConfig(config.getConfig("zuora.contribution.annual")),
    digitalPack = digitalPackFromConfig(config.getConfig("zuora.digitalpack")),
    supporterPlusConfig = supporterPlusFromConfig(config.getConfig("zuora.supporterplus")),
    guardianLight = guardianLightFromConfig(config.getConfig("zuora.guardianlight")),
  )

  private def contributionFromConfig(config: Config): ZuoraContributionConfig = ZuoraContributionConfig(
    productRatePlanId = config.getString("productRatePlanId"),
    productRatePlanChargeId = config.getString("productRatePlanChargeId"),
  )

  private def digitalPackFromConfig(config: Config) = ZuoraDigitalPackConfig(
    defaultFreeTrialPeriod = config.getInt("defaultFreeTrialPeriodDays"),
    paymentGracePeriod = config.getInt("paymentGracePeriod"),
    monthlyChargeId = config.getString("monthly.productRatePlanChargeId"),
    annualChargeId = config.getString("annual.productRatePlanChargeId"),
  )

  private def guardianLightFromConfig(config: Config): ZuoraGuardianLightConfig = ZuoraGuardianLightConfig(
    paymentGracePeriod = config.getInt("paymentGracePeriod"),
    monthlyChargeId = config.getString("monthly.productRatePlanChargeId"),
  )

  private def supporterPlusFromConfig(config: Config) = ZuoraSupporterPlusConfig(
    monthlyChargeId = config.getString("monthly.productRatePlanChargeId"),
    annualChargeId = config.getString("annual.productRatePlanChargeId"),
    v2 = V2(
      monthlyContributionChargeId = config.getString("v2.monthly.contribution.productRatePlanChargeId"),
      annualContributionChargeId = config.getString("v2.annual.contribution.productRatePlanChargeId"),
    ),
  )
}
