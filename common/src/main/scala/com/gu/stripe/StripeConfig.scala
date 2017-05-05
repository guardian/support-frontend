package com.gu.stripe

import com.typesafe.config.Config

case class StripeConfig(secretKey: String, publicKey: String)

object StripeConfig {
  def fromConfig(config : Config): StripeConfig = StripeConfig(
    secretKey = config.getString(s"stripe.api.key.secret"),
    publicKey = config.getString(s"stripe.api.key.public")
  )
}
