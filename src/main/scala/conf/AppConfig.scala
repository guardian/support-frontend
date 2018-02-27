package conf

import cats.data.Validated
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import conf.ConfigLoader._
import model.InitializationError
import play.api.{Configuration, Mode}

case class AppConfig(secret: String)


object AppConfig {
  implicit val appConfigParameterStoreLoadable: ParameterStoreLoadableByPlayAppMode[AppConfig] = new ParameterStoreLoadableByPlayAppMode[AppConfig] {

    override def parametersByPathRequest(mode: Mode): GetParametersByPathRequest =
      new GetParametersByPathRequest()
        .withPath(s"/payment-api/app-config/${mode.asJava.toString.toLowerCase}/")
        .withRecursive(false)
        .withWithDecryption(true)

    override def decode(mode: Mode, data: Map[String, String]): Validated[InitializationError, AppConfig] = {
      val validator = new ParameterStoreValidator[AppConfig, Mode](mode, data); import validator._
      validate("secret").map(AppConfig.apply)
    }
  }

  implicit val appConfigCovertibleToPlayConfig: PlayConfigEncoder[AppConfig] = new PlayConfigEncoder[AppConfig] {
    override def asPlayConfig(conf: AppConfig): Configuration = {
      // I wonder if I can just do "play.http.secret.key"?
      Configuration(
        "play" -> Map(
          "http" -> Map(
            "secret" -> Map(
              "key" -> conf.secret
            )
          )
        )
      )
    }
  }
}