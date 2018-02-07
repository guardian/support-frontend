package conf

import cats.data.Validated
import cats.syntax.apply._
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest

import conf.ParameterStoreConfigLoader.{ParameterStoreLoadable, ParameterStoreValidator}
import model.Environment

case class PaypalConfig(clientId: String, clientSecret: String)

object PaypalConfig {

  implicit val paypalConfigParameterStoreLoadable: ParameterStoreLoadable[PaypalConfig] = new ParameterStoreLoadable[PaypalConfig] {

    override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
      new GetParametersByPathRequest()
        .withPath(s"/payment-api/paypal-config/${environment.entryName}/")
        .withRecursive(false)
        .withWithDecryption(true)

    override def decode(environment: Environment, data: Map[String, String]): Validated[ParameterStoreConfigLoader.ConfigLoadError, PaypalConfig] = {
      val validator = new ParameterStoreValidator[PaypalConfig](environment, data); import validator._
      (
        validate("client-id"),
        validate("client-secret")
      ).mapN(PaypalConfig.apply)
    }
  }
}
