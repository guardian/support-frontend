package com.gu.support.config

import com.typesafe.config.Config

case class StripeConfig(secretKey: String, publicKey: String) extends TouchpointConfig

class StripeConfigProvider(config: Config, defaultStage: Stage, prefix: String = "stripe") extends TouchpointConfigProvider[StripeConfig](config, defaultStage) {
  def fromConfig(config: Config): StripeConfig = StripeConfig(
    secretKey = config.getString(s"$prefix.api.key.secret"),
    publicKey = config.getString(s"$prefix.api.key.public")
  )
}
