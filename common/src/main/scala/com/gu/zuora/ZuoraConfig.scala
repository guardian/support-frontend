package com.gu.zuora

import com.gu.support.config.{Stage, TouchpointConfig, TouchpointConfigProvider}
import com.gu.support.workers.model.{Annual, BillingPeriod}
import com.typesafe.config.Config

case class ZuoraContributionConfig(productRatePlanId: String, productRatePlanChargeId: String)

case class ZuoraConfig(
  url: String,
  username: String,
  password: String,
  monthlyContribution: ZuoraContributionConfig,
  annualContribution: ZuoraContributionConfig)
  extends TouchpointConfig {
  def configForBillingPeriod(billingPeriod: BillingPeriod): ZuoraContributionConfig =
    billingPeriod match {
      case Annual => annualContribution
      case _ => monthlyContribution
    }
}

class ZuoraConfigProvider(config: Config, defaultStage: Stage) extends TouchpointConfigProvider[ZuoraConfig](config, defaultStage) {
  def fromConfig(config: Config): ZuoraConfig = ZuoraConfig(
    url = config.getString(s"zuora.api.url"),
    username = config.getString(s"zuora.api.username"),
    password = config.getString(s"zuora.api.password"),
    monthlyContribution = contributionFromConfig(config.getConfig("zuora.contribution.monthly")),
    annualContribution = contributionFromConfig(config.getConfig("zuora.contribution.annual"))
  )

  private def contributionFromConfig(config: Config): ZuoraContributionConfig = ZuoraContributionConfig(
    productRatePlanId = config.getString("productRatePlanId"),
    productRatePlanChargeId = config.getString("productRatePlanChargeId")
  )
}
