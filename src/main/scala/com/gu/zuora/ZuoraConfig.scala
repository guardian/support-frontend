package com.gu.zuora

import com.gu.support.config.{Stage, TouchpointConfig, TouchpointConfigProvider}
import com.gu.support.workers.model.{Annual, BillingPeriod, Monthly, Quarterly}
import com.gu.zuora.ZuoraConfig.RatePlanId
import com.typesafe.config.Config

object ZuoraConfig {
  type RatePlanId = String
}

case class ZuoraContributionConfig(productRatePlanId: RatePlanId, productRatePlanChargeId: RatePlanId)

case class ZuoraDigitalPackConfig(monthly: RatePlanId, quarterly: RatePlanId, annual: RatePlanId)

case class ZuoraConfig(
    url: String,
    username: String,
    password: String,
    monthlyContribution: ZuoraContributionConfig,
    annualContribution: ZuoraContributionConfig,
    digitalPack: ZuoraDigitalPackConfig
) extends TouchpointConfig {

  def contributionConfig(billingPeriod: BillingPeriod): ZuoraContributionConfig =
    billingPeriod match {
      case Annual => annualContribution
      case _ => monthlyContribution
    }

  def digitalPackRatePlan(billingPeriod: BillingPeriod) = billingPeriod match {
    case Annual => digitalPack.annual
    case Quarterly => digitalPack.quarterly
    case Monthly => digitalPack.monthly
  }
}

class ZuoraConfigProvider(config: Config, defaultStage: Stage) extends TouchpointConfigProvider[ZuoraConfig](config, defaultStage) {

  def fromConfig(config: Config): ZuoraConfig = ZuoraConfig(
    url = config.getString(s"zuora.api.url"),
    username = config.getString(s"zuora.api.username"),
    password = config.getString(s"zuora.api.password"),
    monthlyContribution = contributionFromConfig(config.getConfig("zuora.contribution.monthly")),
    annualContribution = contributionFromConfig(config.getConfig("zuora.contribution.annual")),
    digitalPack = digitalPackFromConfig(config.getConfig("zuora.digitalpack"))
  )

  private def contributionFromConfig(config: Config): ZuoraContributionConfig = ZuoraContributionConfig(
    productRatePlanId = config.getString("productRatePlanId"),
    productRatePlanChargeId = config.getString("productRatePlanChargeId")
  )

  private def digitalPackFromConfig(config: Config) = ZuoraDigitalPackConfig(
    monthly = config.getString("monthly"),
    quarterly = config.getString("quarterly"),
    annual = config.getString("annual")
  )
}
