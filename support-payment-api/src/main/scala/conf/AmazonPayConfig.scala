package conf

import cats.data.Validated
import cats.syntax.apply._
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import conf.ConfigLoader._
import model.{Environment, InitializationError}

case class AmazonPayConfig(merchantId: String, accessKey: String, secretKey: String, sandboxMode: Boolean)

object AmazonPayConfig {

  implicit val amazonPayConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, AmazonPayConfig] =
    new ParameterStoreLoadable[Environment, AmazonPayConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        new GetParametersByPathRequest()
          .withPath(s"/payment-api/amazon-pay-config/${environment.entryName}/")
          .withRecursive(false)
          .withWithDecryption(true)

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, AmazonPayConfig] = {
        val validator = new ParameterStoreValidator[AmazonPayConfig, Environment](environment, data); import validator._
        val sandboxMode = environment.enumEntry == Environment.Test
        (validate("us-merchant-id"), validate("us-access-key"), validate("us-secret-key"), validated(sandboxMode)).mapN(
          AmazonPayConfig.apply,
        )
      }
    }
}
