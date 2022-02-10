package config

import cats.implicits._
import com.typesafe.config.Config

import scala.util.Try

case class FastlyConfig private (serviceId: String, apiToken: String)

object FastlyConfig {

  // Tries to load a FastlyConfig instance from the fastly object in the configuration.
  // This object should only be specified if we want to purge the Fastly cache.
  // Typically this should be the case if and only if the app is running in CODE or PROD mode.
  def fromConfig(config: Config): Either[Throwable, Option[FastlyConfig]] = {
    type Result[A] = Either[Throwable, A]
    Try(config.getConfig("fastly")).toOption
      .traverse[Result, FastlyConfig] { raw =>
        Either.catchNonFatal {
          FastlyConfig(
            raw.getString("serviceId"),
            raw.getString("apiToken"),
          )
        }
      }
  }
}
