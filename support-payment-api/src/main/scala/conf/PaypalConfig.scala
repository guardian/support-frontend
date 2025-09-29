package conf

import cats.data.Validated
import cats.syntax.apply._
import conf.ConfigLoader._
import model.paypal.PaypalMode
import model.{Environment, InitializationError}
import software.amazon.awssdk.services.ssm.model.GetParametersByPathRequest

case class PaypalConfig(clientId: String, clientSecret: String, hookId: String, paypalMode: PaypalMode)

object PaypalConfig {

  implicit val paypalConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, PaypalConfig] =
    new ParameterStoreLoadable[Environment, PaypalConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        GetParametersByPathRequest
          .builder()
          .path(s"/payment-api/paypal-config/${environment.entryName}/")
          .recursive(false)
          .withDecryption(true)
          .build()

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, PaypalConfig] = {
        val validator = new ParameterStoreValidator[PaypalConfig, Environment](environment, data); import validator._
        (
          validate("client-id"),
          validate("client-secret"),
          validate("hook-id"),
          validated(PaypalMode.fromEnvironment(environment)),
        ).mapN(PaypalConfig.apply)
      }
    }
}
