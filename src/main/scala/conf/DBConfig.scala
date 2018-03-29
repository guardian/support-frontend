package conf

import cats.data.Validated
import cats.syntax.apply._
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import play.api.Configuration

import conf.ConfigLoader._
import model.{Environment, InitializationError}

case class DBConfig(env: Environment, url: String, driver: String, username: String, password: String)

object DBConfig {

  implicit val dbConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, DBConfig] = new ParameterStoreLoadable[Environment, DBConfig] {

    override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
      new GetParametersByPathRequest()
        .withPath(s"/payment-api/db-config/${environment.entryName}/")
        .withRecursive(false)
        .withWithDecryption(true)

    override def decode(env: Environment, data: Map[String, String]): Validated[InitializationError, DBConfig] = {
      val validator = new ParameterStoreValidator[DBConfig, Environment](env, data); import validator._
      (
        validated(env),
        validate("url"),
        validated("org.postgresql.Driver"),
        validate("username"),
        validate("password")
      ).mapN(DBConfig.apply)
    }
  }

  implicit val dbConfigConvertibleToPlayConfig: PlayConfigEncoder[DBConfig] = new PlayConfigEncoder[DBConfig] {
    override def asPlayConfig(conf: DBConfig): Configuration = {
      Configuration(
        "db" -> Map(
          conf.env.entryName -> Map(
            "url" -> conf.url,
            "driver" -> conf.driver,
            "username" -> conf.username,
            "password" -> conf.password
          )
        )
      )
    }
  }
}

