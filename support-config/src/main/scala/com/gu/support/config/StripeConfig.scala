package com.gu.support.config

import com.gu.i18n.Currency
import com.gu.i18n.Currency.AUD
import com.typesafe.config.Config


case class StripeConfig(defaultAccount: StripeAccountConfig, australiaAccount: StripeAccountConfig, version: Option[String] = None)
  extends TouchpointConfig {
  def forCurrency(country: Option[Currency] = None) =
    country match {
      case Some(AUD) => australiaAccount
      case _ => defaultAccount
    }
}

case class StripeAccountConfig(secretKey: String, publicKey: String)

class StripeConfigProvider(config: Config, defaultStage: Stage, prefix: String = "stripe")
  extends TouchpointConfigProvider[StripeConfig](config, defaultStage) {
  def fromConfig(config: Config): StripeConfig = StripeConfig(
    accountFromConfig(config, prefix, "default"),
    accountFromConfig(config, prefix, "AUD"),
    version = stripeVersion(config)
  )

  private def accountFromConfig(config: Config, prefix: String, country: String) =
    StripeAccountConfig(
      secretKey = config.getString(s"$prefix.$country.api.key.secret"),
      publicKey = config.getString(s"$prefix.$country.api.key.public")
    )

  private def stripeVersion(config: Config): Option[String] = {
    val stripeVersion = "stripe.api.version"
    if (config.hasPath(stripeVersion)) Some(config.getString(stripeVersion)) else None
  }
}
