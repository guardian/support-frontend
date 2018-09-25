package config

import cats.implicits._
import com.typesafe.config.Config

import scala.util.Try

case class FastlyConfig private (serviceId: String, apiToken: String)

object FastlyConfig {

  def fromConfig(config: Config): Either[Throwable, Option[FastlyConfig]] = {
    type Result[A] = Either[Throwable, A]
    Try(config.getConfig("fastly"))
      .toOption
      .traverse[Result, FastlyConfig] { raw =>
        Either.catchNonFatal {
          FastlyConfig(
            raw.getString("fastly.serviceId"),
            raw.getString("fastly.apiToken")
          )
        }
      }
  }
}
