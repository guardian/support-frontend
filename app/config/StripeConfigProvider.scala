package config

import com.typesafe.config.Config

case class StripeConfig(publicKey: String) extends TouchpointConfig

class StripeConfigProvider(config: Config, defaultStage: Stage) extends TouchpointConfigProvider[StripeConfig](config, defaultStage) {
  def fromConfig(config: Config): StripeConfig = {
    StripeConfig(config.getString("api.key.public"))
  }
}
