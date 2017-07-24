package config

import com.typesafe.config.Config

case class StripeConfig(publicKey: String) extends TouchpointConfig

class StripeConfigProvider(config: Config, defaultEnvironment: TouchPointEnvironment, prefix: String = "stripe")
    extends TouchpointConfigProvider[StripeConfig](config, defaultEnvironment) {
  def fromConfig(config: Config): StripeConfig = {
    StripeConfig(config.getString(s"$prefix.api.key.public"))
  }
}
