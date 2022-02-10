package conf

import cats.data.Validated
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest

import conf.ConfigLoader._
import model.{Environment, InitializationError}

case class OphanConfig(ophanEndpoint: String)

object OphanConfig {

  implicit val ophanConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, OphanConfig] =
    new ParameterStoreLoadable[Environment, OphanConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        new GetParametersByPathRequest()
          .withPath(s"/payment-api/ophan-config/${environment.entryName}/")
          .withRecursive(false)
          .withWithDecryption(true)

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, OphanConfig] = {
        val validator = new ParameterStoreValidator[OphanConfig, Environment](environment, data); import validator._
        validate("endpoint").map(OphanConfig.apply)
      }
    }
}
