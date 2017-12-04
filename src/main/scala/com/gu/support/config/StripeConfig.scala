package com.gu.support.config

import com.typesafe.config.{Config, ConfigException}

import scala.util.control.Exception.catching

case class StripeConfig(secretKey: String, publicKey: String, version: Option[String]) extends TouchpointConfig

class StripeConfigProvider(config: Config, defaultStage: Stage, prefix: String = "stripe", version: Option[String] = None) extends TouchpointConfigProvider[StripeConfig](config, defaultStage) {
  def fromConfig(config: Config): StripeConfig = StripeConfig(
    secretKey = config.getString(s"$prefix.api.key.secret"),
    publicKey = config.getString(s"$prefix.api.key.public"),
    version = stripeVersion(config)
  )

  def stripeVersion(config: Config): Option[String] = {
    val catchMissing = catching(classOf[ConfigException.Missing])
    catchMissing opt config.getString(s"stripe.api.version")
  }
}
