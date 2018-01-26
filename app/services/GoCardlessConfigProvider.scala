package services

import com.gu.support.config.{Stage, TouchpointConfig, TouchpointConfigProvider}
import com.typesafe.config.Config

case class GoCardlessConfig(
  payPalEnvironment: String,
  NVPVersion: String,
  url: String,
  user: String,
  password: String,
  signature: String
) extends TouchpointConfig

class GoCardlessConfigProvider(config: Config, defaultStage: Stage) extends TouchpointConfigProvider[GoCardlessConfig](config, defaultStage) {
  def fromConfig(config: Config): GoCardlessConfig = {
    GoCardlessConfig(
      config.getString("paypal.paypal-environment"),
      config.getString("paypal.nvp-version"),
      config.getString("paypal.url"),
      config.getString("paypal.user"),
      config.getString("paypal.password"),
      config.getString("paypal.signature")
    )
  }
}
