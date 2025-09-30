package conf

import cats.data.Validated
import conf.ConfigLoader._
import model.{Environment, InitializationError}
import software.amazon.awssdk.services.ssm.model.GetParametersByPathRequest

case class EmailConfig(queueName: String)

object EmailConfig {

  implicit val emailConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, EmailConfig] =
    new ParameterStoreLoadable[Environment, EmailConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        buildPathRequest(s"/payment-api/email-config/${environment.entryName}/")

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, EmailConfig] = {
        val validator = new ParameterStoreValidator[OphanConfig, Environment](environment, data); import validator._
        validate("queue").map(EmailConfig.apply)
      }
    }
}
