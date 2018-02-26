package conf

import cats.data.Validated
import cats.syntax.apply._
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest

import conf.ConfigLoader._
import model.{Environment, InitializationError}

// TODO: just use Play's DatabaseConfig case class instead?
case class DBConfig(env: Environment, url: String, driver: String, username: String, password: String)

object DBConfig {

  implicit val dbConfigParameterStoreLoadable: ParameterStoreLoadable[DBConfig] = new ParameterStoreLoadable[DBConfig] {

    override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
      new GetParametersByPathRequest()
        .withPath(s"/payment-api/db-config/${environment.entryName}/")
        .withRecursive(false)
        .withWithDecryption(true)

    override def decode(env: Environment, data: Map[String, String]): Validated[InitializationError, DBConfig] = {

      val validator = new ParameterStoreValidator[DBConfig](env, data); import validator._
      (
        validated(env),
        validate("url"),
        validated("org.postgresql.Driver"),
        validate("username"),
        validate("password")
      ).mapN(DBConfig.apply)
    }
  }
}