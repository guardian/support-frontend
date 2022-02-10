package conf

import play.api.{Configuration, Mode}
import simulacrum.typeclass

import conf.ConfigLoader._ // This is required, whatever intellij says
import model.{InitializationResult, RequestEnvironments}

@typeclass trait PlayConfigEncoder[A] {
  def asPlayConfig(data: A): Configuration
}

class PlayConfigUpdater(configLoader: ConfigLoader) {
  import PlayConfigEncoder.ops._

  def updateConfiguration(
      configuration: Configuration,
      environments: RequestEnvironments,
      mode: Mode,
  ): InitializationResult[Configuration] = {
    configLoader.loadConfig[Mode, AppConfig](mode).map(appMode => configuration ++ appMode.asPlayConfig)
  }
}
