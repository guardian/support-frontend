package conf

import cats.syntax.apply._
import play.api.{Configuration, Mode}
import simulacrum.typeclass

import conf.ConfigLoader._
import model.{Environment, InitializationResult, RequestEnvironments}

@typeclass trait PlayConfigEncoder[A] {
  def asPlayConfig(data: A): Configuration
}

class PlayConfigUpdater(configLoader: ConfigLoader) {
  import PlayConfigEncoder.ops._

  def updateConfiguration(configuration: Configuration, environments: RequestEnvironments, mode: Mode): InitializationResult[Configuration] = {
    (
      configLoader.loadConfig[Environment, DBConfig](environments.test),
      configLoader.loadConfig[Environment, DBConfig](environments.live),
      configLoader.loadConfig[Mode, AppConfig](mode)
    ).mapN { (testDbConfig, liveDbConfig, appMode) =>
      configuration ++ testDbConfig.asPlayConfig ++ liveDbConfig.asPlayConfig ++ appMode.asPlayConfig
    }
  }
}