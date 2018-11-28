package com.gu.support.config


import com.gu.support.catalog.{ProductRatePlanChargeId, ProductRatePlanId}
import com.gu.support.workers.model.{Annual, BillingPeriod, Monthly, Quarterly}
import com.typesafe.config.Config

case class ZuoraContributionConfig(productRatePlanId: ProductRatePlanId, productRatePlanChargeId: ProductRatePlanChargeId)

case class ZuoraDigitalPackConfig(defaultFreeTrialPeriod: Int, paymentGracePeriod: Int, productRatePlans: ProductRatePlans)

case class ZuoraDiscountsConfig(productRatePlanId: ProductRatePlanId, productRatePlanChargeId: ProductRatePlanChargeId)

case class ProductRatePlans(monthly: ProductRatePlanId, quarterly: ProductRatePlanId, annual: ProductRatePlanId)

case class ZuoraConfig(
  url: String,
  username: String,
  password: String,
  monthlyContribution: ZuoraContributionConfig,
  annualContribution: ZuoraContributionConfig,
  digitalPack: ZuoraDigitalPackConfig,
  discounts: ZuoraDiscountsConfig
) extends TouchpointConfig {

  def contributionConfig(billingPeriod: BillingPeriod): ZuoraContributionConfig =
    billingPeriod match {
      case Annual => annualContribution
      case _ => monthlyContribution
    }

  def digitalPackRatePlan(billingPeriod: BillingPeriod): ProductRatePlanId = billingPeriod match {
    case Annual => digitalPack.productRatePlans.annual
    case Quarterly => digitalPack.productRatePlans.quarterly
    case Monthly => digitalPack.productRatePlans.monthly
  }
}

class ZuoraConfigProvider(config: Config, defaultStage: Stage) extends TouchpointConfigProvider[ZuoraConfig](config, defaultStage) {

  def fromConfig(config: Config): ZuoraConfig = ZuoraConfig(
    url = config.getString(s"zuora.api.url"),
    username = config.getString(s"zuora.api.username"),
    password = config.getString(s"zuora.api.password"),
    monthlyContribution = contributionFromConfig(config.getConfig("zuora.contribution.monthly")),
    annualContribution = contributionFromConfig(config.getConfig("zuora.contribution.annual")),
    digitalPack = digitalPackFromConfig(config.getConfig("zuora.digitalpack")),
    discounts = discountsFromConfig(config.getConfig("zuora.discounts"))
  )

  private def contributionFromConfig(config: Config): ZuoraContributionConfig = ZuoraContributionConfig(
    productRatePlanId = config.getString("productRatePlanId"),
    productRatePlanChargeId = config.getString("productRatePlanChargeId")
  )

  private def digitalPackFromConfig(config: Config) = ZuoraDigitalPackConfig(
    defaultFreeTrialPeriod = config.getInt("defaultFreeTrialPeriodDays"),
    paymentGracePeriod = config.getInt("paymentGracePeriod"),
    productRatePlans = ProductRatePlans(
      monthly = config.getString("productRatePlanIds.monthly"),
      quarterly = config.getString("productRatePlanIds.quarterly"),
      annual = config.getString("productRatePlanIds.annual")
    )
  )

  private def discountsFromConfig(config: Config): ZuoraDiscountsConfig = ZuoraDiscountsConfig(
    productRatePlanId = config.getString("productRatePlanId"),
    productRatePlanChargeId = config.getString("productRatePlanChargeId")
  )
}
