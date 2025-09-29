package conf

import cats.data.Validated
import cats.syntax.apply._
import conf.ConfigLoader._
import model.{Environment, InitializationError}
import software.amazon.awssdk.services.ssm.model.GetParametersByPathRequest

case class IdentityConfig(endpoint: String, accessToken: String)

object IdentityConfig {

  implicit val identityConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, IdentityConfig] =
    new ParameterStoreLoadable[Environment, IdentityConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        GetParametersByPathRequest
          .builder()
          .path(s"/payment-api/identity-config/${environment.entryName}/")
          .withDecryption(true)
          .recursive(false)
          .build()

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
