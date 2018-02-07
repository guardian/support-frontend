package conf

import cats.data.Validated
import cats.syntax.apply._
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import play.api.Configuration

import conf.ConfigurationUpdater.ConfigurationEncoder
import conf.ParameterStoreConfigLoader._
import model.Environment

case class DBConfig(env: Environment, url: String, driver: String, username: String, password: String)

object DBConfig {

  implicit val dbConfigParameterStoreLoadable: ParameterStoreLoadable[DBConfig] = new ParameterStoreLoadable[DBConfig] {

    override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
      new GetParametersByPathRequest()
        .withPath(s"/payment-api/db-config/${environment.entryName}/")
        .withRecursive(false)
        .withWithDecryption(true)

    override def decode(env: Environment, data: Map[String, String]): Validated[ConfigLoadError, DBConfig] = {
      val validator = new ParameterStoreValidator[DBConfig](env, data); import validator._
      (
        validated(env),
        validate("url"),
        validate("driver"),
        validate("username"),
        validate("password")
      ).mapN(DBConfig.apply)
    }
  }

  implicit val dbConfigConfigurationEncoder: ConfigurationEncoder[DBConfig] =
    ConfigurationEncoder.instance { config =>
      import config._
      Configuration(
        "db" -> Map(
          env.entryName -> Map(
            "url" -> url,
            "driver" -> driver,
            "username" -> username,
            "password" -> password
          )
        )
      )
    }
}