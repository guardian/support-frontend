package conf

import play.api.Configuration

import conf.ConfigurationUpdater.ConfigurationEncoder
import model.Environment

case class EnvironmentConfigs[A](configs: Map[Environment, A])

object EnvironmentConfigs {

  implicit def configurationEncoder[A : ConfigurationEncoder]: ConfigurationEncoder[EnvironmentConfigs[A]] =  {
    import ConfigurationEncoder.ops._
    ConfigurationEncoder.instance { env =>
      env.configs.foldLeft(Configuration.empty) { case (config, (_, envConfig)) =>
        config ++ envConfig.asConfiguration
      }
    }
  }
}