package conf

import cats.data.Validated
import cats.syntax.apply._
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest

import conf.ConfigLoader._
import model.{Environment, InitializationError}

case class ContributionsStoreQueueConfig(queueUrl: String, keyId: String)

object ContributionsStoreQueueConfig {

  implicit val contributionsStoreQueueConfigParameterStoreLoadable
      : ParameterStoreLoadable[Environment, ContributionsStoreQueueConfig] =
    new ParameterStoreLoadable[Environment, ContributionsStoreQueueConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        new GetParametersByPathRequest()
          .withPath(s"/payment-api/contributions-store-queue/${environment.entryName}/")
          .withRecursive(false)
          .withWithDecryption(true)

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
