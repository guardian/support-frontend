package conf

import cats.data.Validated
import cats.syntax.apply._
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest

import conf.ConfigLoader._
import model.{Environment, InitializationError}

case class IdentityConfig(endpoint: String, accessToken: String)

object IdentityConfig {

  implicit val identityConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, IdentityConfig] =
    new ParameterStoreLoadable[Environment, IdentityConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        new GetParametersByPathRequest()
          .withPath(s"/payment-api/identity-config/${environment.entryName}/")
          .withWithDecryption(true)
          .withRecursive(false)

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, IdentityConfig] = {
        val validator = new ParameterStoreValidator[IdentityConfig, Environment](environment, data); import validator._
        (
          validate("endpoint"),
          validate("access-token"),
        ).mapN(IdentityConfig.apply)
      }
    }
}
