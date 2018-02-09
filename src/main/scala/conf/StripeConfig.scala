package conf

import cats.data.Validated
import cats.syntax.apply._
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest

import conf.ConfigLoader.{ParameterStoreLoadable, ParameterStoreValidator}
import model.{Environment, InitializationError}

case class StripeAccountConfig(publicKey: String, secretKey: String)

case class StripeConfig(default: StripeAccountConfig, au: StripeAccountConfig)

object StripeConfig {

  implicit val stripeConfigParameterStoreLoadable: ParameterStoreLoadable[StripeConfig] = new ParameterStoreLoadable[StripeConfig] {

    override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
      new GetParametersByPathRequest()
        .withPath(s"/payment-api/stripe-config/${environment.entryName}/")
        .withWithDecryption(true)
        .withRecursive(false)

    override def decode(environment: Environment, data: Map[String, String]): Validated[InitializationError, StripeConfig] = {
      val validator = new ParameterStoreValidator[StripeConfig](environment, data); import validator._

      val defaultAccount = (
        validate("default-public-key"),
        validate("default-private-key")
      ).mapN(StripeAccountConfig.apply)

      val auAccount = (
        validate("au-public-key"),
        validate("au-private-key")
      ).mapN(StripeAccountConfig.apply)

      (defaultAccount, auAccount).mapN(StripeConfig.apply)
    }
  }
}


