package conf

import cats.data.Validated
import conf.ConfigLoader.{ParameterStoreLoadable, _}
import model.{Environment, InitializationError}
import software.amazon.awssdk.services.ssm.model.GetParametersByPathRequest

case class RecaptchaConfig(secretKey: String)

object RecaptchaConfig {

  implicit val stripeConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, RecaptchaConfig] =
    new ParameterStoreLoadable[Environment, RecaptchaConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        GetParametersByPathRequest
          .builder()
          .path(s"/payment-api/recaptcha-config/${environment.entryName}/")
          .withDecryption(true)
          .recursive(false)
          .build()

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
