package com.gu.support.config

import com.typesafe.config.Config

case class PayPalConfig(
    payPalEnvironment: String,
    NVPVersion: String,
    url: String,
    user: String,
    password: String,
    signature: String,
)
class PayPalConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[PayPalConfig](config, defaultStage) {
  def fromConfig(config: Config): PayPalConfig = {
    PayPalConfig(
      config.getString("paypal.paypal-environment"),
      config.getString("paypal.nvp-version"),
      config.getString("paypal.url"),
      config.getString("paypal.user"),
      config.getString("paypal.password"),
      config.getString("paypal.signature"),
    )
  }
}
