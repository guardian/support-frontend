package config

import cats.syntax.either._
import com.typesafe.config.Config

case class FastlyConfig private (serviceId: String, apiToken: String)

object FastlyConfig {

  def fromConfig(config: Config): Either[Throwable, FastlyConfig] =
    Either.catchNonFatal {
      FastlyConfig(
        config.getString("fastly.serviceId"),
        config.getString("fastly.apiToken")
      )
    }
}
