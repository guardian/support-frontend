package com.gu.support.config

import com.typesafe.config.Config

case class StripeConfig(secretKey: String, publicKey: String, version: Option[String]) extends TouchpointConfig

class StripeConfigProvider(config: Config, defaultStage: Stage, prefix: String = "stripe", version: Option[String] = None) extends TouchpointConfigProvider[StripeConfig](config, defaultStage) {
  def fromConfig(config: Config): StripeConfig = StripeConfig(
    secretKey = config.getString(s"$prefix.api.key.secret"),
    publicKey = config.getString(s"$prefix.api.key.public"),
    version = stripeVersion(config)
  )

  def stripeVersion(config: Config): Option[String] = {
    val stripeVersion = "stripe.api.version"
    if (config.hasPath(stripeVersion)) Some(config.getString(stripeVersion)) else None
  }
}
