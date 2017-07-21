package config

import com.typesafe.config.Config

case class StripeConfig(publicKey: String) extends TouchpointConfig

class StripeConfigProvider(config: Config, defaultEnvironment: TouchPointEnvironment)
    extends TouchpointConfigProvider[StripeConfig](config, defaultEnvironment) {
  def fromConfig(config: Config): StripeConfig = {
    StripeConfig(config.getString("stripe.api.key.public"))
  }
}
