package conf

import cats.data.Validated
import cats.syntax.apply._
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import conf.ConfigLoader.{ParameterStoreLoadableByEnvironment, ParameterStoreValidator, environmentShow}
import model.{Environment, InitializationError}

sealed trait StripeAccountConfig {
  def publicKey: String
  def secretKey: String
}

object StripeAccountConfig {

  // Try to ensure some type safety for using the different accounts in conjunction
  case class Default(publicKey: String, secretKey: String) extends StripeAccountConfig
  case class Australia(publicKey: String, secretKey: String) extends StripeAccountConfig
}

case class StripeConfig(default: StripeAccountConfig.Default, au: StripeAccountConfig.Australia)

object StripeConfig {

  implicit val stripeConfigParameterStoreLoadable: ParameterStoreLoadableByEnvironment[StripeConfig] = new ParameterStoreLoadableByEnvironment[StripeConfig] {

    override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
      new GetParametersByPathRequest()
        .withPath(s"/payment-api/stripe-config/${environment.entryName}/")
        .withWithDecryption(true)
        .withRecursive(false)

    override def decode(environment: Environment, data: Map[String, String]): Validated[InitializationError, StripeConfig] = {
      val validator = new ParameterStoreValidator[StripeConfig, Environment](environment, data); import validator._

      val defaultAccount = (
        validate("default-public-key"),
        validate("default-private-key")
      ).mapN(StripeAccountConfig.Default.apply)

      val auAccount = (
        validate("au-public-key"),
        validate("au-private-key")
      ).mapN(StripeAccountConfig.Australia.apply)

      (defaultAccount, auAccount).mapN(StripeConfig.apply)
    }
  }
}
