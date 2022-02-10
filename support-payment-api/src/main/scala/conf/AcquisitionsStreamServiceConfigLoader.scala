package conf

import cats.data.Validated
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import com.gu.support.acquisitions.AcquisitionsStreamEc2OrLocalConfig

import conf.ConfigLoader._
import model.{Environment, InitializationError}
import com.amazonaws.auth.AWSCredentialsProviderChain
import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.InstanceProfileCredentialsProvider

object AcquisitionsStreamConfigLoader {
  implicit val acquisitionsStreamec2OrLocalConfigLoader
      : ParameterStoreLoadable[Environment, AcquisitionsStreamEc2OrLocalConfig] =
    new ParameterStoreLoadable[Environment, AcquisitionsStreamEc2OrLocalConfig] {

      override def parametersByPathRequest(environment: Environment): GetParametersByPathRequest =
        new GetParametersByPathRequest()
          .withPath(s"/payment-api/kinesis-config/${environment.entryName}/")
          .withRecursive(false)
          .withWithDecryption(true)

      override def decode(
          environment: Environment,
          data: Map[String, String],
      ): Validated[InitializationError, AcquisitionsStreamEc2OrLocalConfig] = {

        val credentialsProvider = new AWSCredentialsProviderChain(
          new ProfileCredentialsProvider("membership"),
          InstanceProfileCredentialsProvider.getInstance(),
        )

        val validator = new ParameterStoreValidator[AcquisitionsStreamEc2OrLocalConfig, Environment](environment, data);
        import validator._
        validate("stream-name").map(streamName => AcquisitionsStreamEc2OrLocalConfig(streamName, credentialsProvider))
      }
    }
}
