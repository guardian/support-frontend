package conf

import cats.data.Validated
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import conf.ConfigLoader.{ParameterStoreLoadable, _}
import model.{Environment, InitializationError}

case class RecaptchaConfig(secretKey: String)

object RecaptchaConfig {

  implicit val stripeConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, RecaptchaConfig] =
    new ParameterStoreLoadable[Environment, RecaptchaConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        new GetParametersByPathRequest()
          .withPath(s"/payment-api/recaptcha-config/${environment.entryName}/")
          .withWithDecryption(true)
          .withRecursive(false)

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, RecaptchaConfig] = {
        val validator = new ParameterStoreValidator[StripeConfig, Environment](environment, data)
        import validator._

        validate("secret-key").map(RecaptchaConfig.apply)
      }

    }
}
