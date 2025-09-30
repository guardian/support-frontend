package conf

import cats.data.Validated
import cats.syntax.apply._
import com.gocardless.GoCardlessClient
import conf.ConfigLoader.{ParameterStoreLoadable, ParameterStoreValidator}
import conf.ConfigLoader._
import model.{Environment, InitializationError}
import software.amazon.awssdk.services.ssm.model.GetParametersByPathRequest

case class GoCardlessConfig(gcEnvironment: GoCardlessClient.Environment, token: String)

object GoCardlessConfig {

  implicit val goCardlessConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, GoCardlessConfig] =
    new ParameterStoreLoadable[Environment, GoCardlessConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        buildPathRequest(s"/payment-api/gocardless-config/${environment.entryName}/")

      override def decode(
          paymentApiEnvironment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, GoCardlessConfig] = {
        val validator = new ParameterStoreValidator[GoCardlessConfig, Environment](paymentApiEnvironment, data);
        import validator._
        (
          validated(paymentApiEnvironment match {
            case Environment.Live => GoCardlessClient.Environment.LIVE
            case Environment.Test => GoCardlessClient.Environment.SANDBOX
          }),
          validate("api-token"),
        ).mapN(GoCardlessConfig.apply)
      }
    }
}
