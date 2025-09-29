package conf

import cats.data.Validated
import conf.ConfigLoader._
import model.{Environment, InitializationError}
import software.amazon.awssdk.services.ssm.model.GetParametersByPathRequest

case class OphanConfig(ophanEndpoint: String)

object OphanConfig {

  implicit val ophanConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, OphanConfig] =
    new ParameterStoreLoadable[Environment, OphanConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        GetParametersByPathRequest
          .builder()
          .path(s"/payment-api/ophan-config/${environment.entryName}/")
          .recursive(false)
          .withDecryption(true)
          .build()

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, OphanConfig] = {
        val validator = new ParameterStoreValidator[OphanConfig, Environment](environment, data); import validator._
        validate("endpoint").map(OphanConfig.apply)
      }
    }
}
