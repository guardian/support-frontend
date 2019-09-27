package com.gu.support.config

import com.gu.i18n.Currency
import com.gu.monitoring.SafeLogger
import com.typesafe.config.Config


case class BraintreeConfig(account: BraintreeAccountConfig) extends TouchpointConfig


case class BraintreeAccountConfig(tokenizationKey: String)

class BraintreeConfigProvider(config: Config, defaultStage: Stage)
  extends TouchpointConfigProvider[BraintreeConfig](config, defaultStage) {
  def fromConfig(config: Config): BraintreeConfig = BraintreeConfig(accountFromConfig(config))

  private def accountFromConfig(config: Config) = BraintreeAccountConfig(config.getString(s"braintree.tokenizationKey"))


}
