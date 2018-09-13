package config

import cats.syntax.either._
import com.typesafe.config.Config

case class FastlyConfig(serviceId: String, apiToken: String)

object FastlyConfig {

  // TODO: put fastly config in private config
  def fromConfig(config: Config): Either[Throwable, FastlyConfig] =
    Either.catchNonFatal {
      FastlyConfig(
        config.getString("fastly.serviceId"),
        config.getString("fastly.apiToken")
      )
    }
}
