package conf

import cats.data.Validated
import play.api.{Configuration, Mode}
import conf.ConfigLoader._
import model.InitializationError
import software.amazon.awssdk.services.ssm.model.GetParametersByPathRequest

case class AppConfig(secret: String)

object AppConfig {

  implicit val appConfigParameterStoreLoadable: ParameterStoreLoadable[Mode, AppConfig] =
    new ParameterStoreLoadable[Mode, AppConfig] {

      override def parametersByPathRequest(mode: Mode): GetParametersByPathRequest =
        GetParametersByPathRequest
          .builder()
          .path(s"/payment-api/app-config/${mode.asJava.toString.toLowerCase}/")
          .recursive(false)
          .withDecryption(true)
          .build()

      override def decode(mode: Mode, data: Map[String, String]): Validated[InitializationError, AppConfig] = {
        val validator = new ParameterStoreValidator[AppConfig, Mode](mode, data); import validator._
        validate("secret").map(AppConfig.apply)
      }
    }

  implicit val appConfigConvertibleToPlayConfig: PlayConfigEncoder[AppConfig] = new PlayConfigEncoder[AppConfig] {
    override def asPlayConfig(conf: AppConfig): Configuration = {
      // I wonder if I can just do "play.http.secret.key"?
      Configuration(
        "play" -> Map(
          "http" -> Map(
            "secret" -> Map(
              "key" -> conf.secret,
            ),
          ),
        ),
      )
    }
  }
}
