package config

import com.typesafe.config.Config

class PayPalConfigProvider(config: Config, defaultStage: Stage) extends TouchpointConfigProvider[PayPalConfig](config, defaultStage) {
  def fromConfig(config: Config): PayPalConfig = {
    PayPalConfig(
      config.getString("paypal.paypal-environment"),
      config.getString("paypal.nvp-version"),
      config.getString("paypal.url"),
      config.getString("paypal.user"),
      config.getString("paypal.password"),
      config.getString("paypal.signature")
    )
  }
}

case class PayPalConfig(
  payPalEnvironment: String,
  NVPVersion: String,
  url: String,
  user: String,
  password: String,
  signature: String
) extends TouchpointConfig