package conf

import cats.data.Validated
import cats.syntax.apply._
import conf.ConfigLoader._
import model.{Environment, InitializationError}
import software.amazon.awssdk.services.ssm.model.GetParametersByPathRequest

case class ContributionsStoreQueueConfig(queueUrl: String, keyId: String)

object ContributionsStoreQueueConfig {

  implicit val contributionsStoreQueueConfigParameterStoreLoadable
      : ParameterStoreLoadable[Environment, ContributionsStoreQueueConfig] =
    new ParameterStoreLoadable[Environment, ContributionsStoreQueueConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        buildPathRequest(s"/payment-api/contributions-store-queue/${environment.entryName}/")

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, ContributionsStoreQueueConfig] = {
        val validator = new ParameterStoreValidator[ContributionsStoreQueueConfig, Environment](environment, data);
        import validator._
        (validate("queueUrl"), validate("keyId")).mapN(ContributionsStoreQueueConfig.apply)
      }
    }
}
