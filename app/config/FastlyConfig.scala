package config

import com.typesafe.config.Config

case class FastlyConfig private (serviceId: String, apiToken: String)

object FastlyConfig {
  // TODO: implement with Lauren
  def fromConfig(config: Config): Either[Throwable, FastlyConfig] = ??? // FIXME
}
