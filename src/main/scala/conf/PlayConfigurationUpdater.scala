package conf

import cats.syntax.apply._
import play.api.Configuration
import simulacrum.typeclass

import conf.PlayConfigurationUpdater.ConfigurationEncoder
import model.{InitializationResult, RequestEnvironments}

class PlayConfigurationUpdater(configLoader: ConfigLoader, environments: RequestEnvironments) {
  import ConfigurationEncoder.ops._

  def updatePlayConfiguration(configuration: Configuration): InitializationResult[Configuration] = {
    (
      configLoader.loadConfig[DBConfig](environments.test),
      configLoader.loadConfig[DBConfig](environments.live)
    ).mapN { case (testConfig, liveConfig) =>
      configuration ++ testConfig.asConfiguration ++ liveConfig.asConfiguration
    }
  }
}

object PlayConfigurationUpdater {

  // Useful for merging data into the Play configuration
  @typeclass trait ConfigurationEncoder[A] {
    def asConfiguration(data: A): Configuration
  }

  object ConfigurationEncoder {
    def instance[A](encode: A => Configuration): ConfigurationEncoder[A] = new ConfigurationEncoder[A] {
      override def asConfiguration(data: A): Configuration = encode(data)
    }
  }
}

