package conf

import play.api.Configuration
import simulacrum.typeclass

object ConfigurationUpdater {

  // Useful for merging data into the Play configuration
  @typeclass trait ConfigurationEncoder[A] {
    def asConfiguration(data: A): Configuration
  }

  object ConfigurationEncoder {
    def instance[A](encode: A => Configuration): ConfigurationEncoder[A] = new ConfigurationEncoder[A] {
      override def asConfiguration(data: A): Configuration = encode(data)
    }
  }

  // Note - the configuration derived from the instance of A takes precedent.
  def updateConfiguration[A : ConfigurationEncoder](configuration: Configuration, data: A): Configuration = {
    import ConfigurationEncoder.ops._
    configuration ++ data.asConfiguration
  }
}

