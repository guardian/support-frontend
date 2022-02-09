package conf

import cats.data.Validated
import cats.syntax.apply._
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import com.gu.support.acquisitions.BigQueryConfig
import conf.ConfigLoader._
import model.{Environment, InitializationError}

object BigQueryConfigLoader {
  implicit val bigQueryConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, BigQueryConfig] =
    new ParameterStoreLoadable[Environment, BigQueryConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        new GetParametersByPathRequest()
          .withPath(s"/payment-api/bigquery-config/${environment.entryName}/")
          .withWithDecryption(true)
          .withRecursive(false)

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, BigQueryConfig] = {
        val validator = new ParameterStoreValidator[BigQueryConfig, Environment](environment, data)
        import validator._
        (
          validate("projectId"),
          validate("clientId"),
          validate("clientEmail"),
          validate("privateKey"),
          validate("privateKeyId"),
        ).mapN(BigQueryConfig.apply)
      }
    }

}
