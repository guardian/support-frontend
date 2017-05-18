package com.gu.stripe

import com.gu.config.{Stage, TouchpointConfig, TouchpointConfigProvider}
import com.typesafe.config.Config

case class StripeConfig(secretKey: String, publicKey: String) extends TouchpointConfig

class StripeConfigProvider(defaultStage: Stage, config: Config) extends TouchpointConfigProvider[StripeConfig](defaultStage, config) {
  def fromConfig(config: Config): StripeConfig = StripeConfig(
    secretKey = config.getString(s"stripe.api.key.secret"),
    publicKey = config.getString(s"stripe.api.key.public")
  )
}
