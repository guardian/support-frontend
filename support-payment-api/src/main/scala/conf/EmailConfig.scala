package conf

import cats.data.Validated
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest

import conf.ConfigLoader._
import model.{Environment, InitializationError}

case class EmailConfig(queueName: String)

object EmailConfig {

  implicit val emailConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, EmailConfig] =
    new ParameterStoreLoadable[Environment, EmailConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        new GetParametersByPathRequest()
          .withPath(s"/payment-api/email-config/${environment.entryName}/")
          .withRecursive(false)
          .withWithDecryption(true)

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, EmailConfig] = {
        val validator = new ParameterStoreValidator[OphanConfig, Environment](environment, data); import validator._
        validate("queue").map(EmailConfig.apply)
      }
    }
}
