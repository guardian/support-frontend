package conf

import model.{InitializationError, RequestEnvironments}
import play.api.{Configuration, Mode}
import simulacrum.typeclass
import cats.syntax.apply._
import ConfigLoader.{ParameterStoreLoadableByEnvironment, ParameterStoreLoadableByPlayAppMode}

import scala.reflect.ClassTag


@typeclass trait PlayConfigEncoder[A] {
  def asPlayConfig(data: A): Configuration
}

class PlayConfigUpdater(val configLoader: ConfigLoader, val configuration: Configuration) {
  import PlayConfigEncoder.ops._

  // We need to load both configs here, since test/live mode can vary per request
  def update[A : ClassTag : PlayConfigEncoder : ParameterStoreLoadableByEnvironment](envs: RequestEnvironments): PlayConfigUpdater = {

    val newConfiguration =
      (configLoader.configForEnvironment[A](envs.test), configLoader.configForEnvironment[A](envs.live))
        .mapN((testConfig: A, liveConfig: A) =>
          configuration ++ testConfig.asPlayConfig ++ liveConfig.asPlayConfig)
        // Ok throwing an exception, since this method is called on the edge of the application
        .valueOr(err => throw InitializationError("unable to update Play config", err))

    new PlayConfigUpdater(configLoader, newConfiguration)
  }

  // We only need to load one config for that actual Play app mode,
  // because the app cannot change mode between requests
  def update[A : ClassTag : PlayConfigEncoder : ParameterStoreLoadableByPlayAppMode](mode: Mode): PlayConfigUpdater = {

    val newConfiguration = configLoader.configForPlayAppMode[A](mode)
      .map(c => configuration ++ c.asPlayConfig)
      .valueOr(err => throw InitializationError("unable to update Play config", err))

    new PlayConfigUpdater(configLoader, newConfiguration)
  }

}