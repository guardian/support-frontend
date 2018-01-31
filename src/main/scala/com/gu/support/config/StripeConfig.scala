package com.gu.support.config

import com.gu.i18n.Country
import com.typesafe.config.Config

case class StripeConfig(config: Config, prefix: String = "stripe") extends TouchpointConfig {
  private val aus = fromConfig(config, prefix, "aus")
  private val default = fromConfig(config, prefix, "default")

  def get(country: Country) =
    country match {
      case Country.Australia => aus
      case _ => default
    }

  private def fromConfig(config: Config, prefix: String, country: String): StripeAccountConfig =
    StripeAccountConfig(
      secretKey = config.getString(s"$prefix.$country.api.key.secret"),
      publicKey = config.getString(s"$prefix.$country.api.key.public"),
      version = stripeVersion(config)
    )

  private def stripeVersion(config: Config): Option[String] = {
    val stripeVersion = "stripe.api.version"
    if (config.hasPath(stripeVersion)) Some(config.getString(stripeVersion)) else None
  }
}

case class StripeAccountConfig(secretKey: String, publicKey: String, version: Option[String])


class StripeConfigProvider(config: Config, defaultStage: Stage, prefix: String = "stripe", version: Option[String] = None) extends TouchpointConfigProvider[StripeConfig](config, defaultStage) {
  def fromConfig(config: Config): StripeConfig = StripeConfig(config)
}
