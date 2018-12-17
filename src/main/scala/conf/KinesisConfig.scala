package conf

import cats.data.Validated
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest

import conf.ConfigLoader._
import model.{Environment, InitializationError}

case class KinesisConfig(streamName: String)

object KinesisConfig {
  implicit val kinesisConfigParameterStoreLoadable: ParameterStoreLoadable[Environment, KinesisConfig] = new ParameterStoreLoadable[Environment, KinesisConfig] {

    override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
      new GetParametersByPathRequest()
        .withPath(s"/payment-api/kinesis-config/${environment.entryName}/")
        .withRecursive(false)
        .withWithDecryption(true)

    override def decode(environment: Environment, data: Map[String, String]): Validated[InitializationError, KinesisConfig] = {
      val validator = new ParameterStoreValidator[KinesisConfig, Environment](environment, data); import validator._
      validate("stream-name").map(KinesisConfig.apply)
    }
  }
}
