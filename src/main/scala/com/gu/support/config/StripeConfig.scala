package com.gu.support.config

import com.gu.i18n.Country
import com.gu.i18n.Country.Australia
import com.typesafe.config.Config


case class StripeConfig(defaultAccount: StripeAccountConfig, australiaAccount: StripeAccountConfig, version: Option[String] = None)
  extends TouchpointConfig {
  def forCountry(country: Option[Country]) =
    country match {
      case Some(Australia) => australiaAccount
      case _ => defaultAccount
    }
}

case class StripeAccountConfig(secretKey: String, publicKey: String)


class StripeConfigProvider(config: Config, defaultStage: Stage, prefix: String = "stripe", version: Option[String] = None)
  extends TouchpointConfigProvider[StripeConfig](config, defaultStage) {
  def fromConfig(config: Config): StripeConfig = StripeConfig(
    accountFromConfig(config, prefix, "AU"),
    accountFromConfig(config, prefix, "default"),
    version = version
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
