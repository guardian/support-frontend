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

object PlayConfigEncoder {

  import PlayConfigEncoder.ops._

  // We need to load both configs here, since test/live mode can vary per request
  def updateForRequestEnvironments[A : ClassTag : PlayConfigEncoder : ParameterStoreLoadableByEnvironment](
      configLoader: ConfigLoader,
      configuration: Configuration,
      envs: RequestEnvironments): Configuration =

    (configLoader.configForEnvironment[A](envs.test), configLoader.configForEnvironment[A](envs.live))
      .mapN((testConfig: A, liveConfig: A) =>
        configuration ++ testConfig.asPlayConfig ++ liveConfig.asPlayConfig)
      // Ok throwing an exception, since this method is called on the edge of the application
      .valueOr(err => throw InitializationError("unable to update Play config", err))

  // We only need to load one config for that actual Play app mode,
  // because the app cannot change mode between requests
  def updateForAppMode[A : ClassTag : PlayConfigEncoder : ParameterStoreLoadableByPlayAppMode](
    configLoader: ConfigLoader,
    configuration: Configuration,
    mode: Mode
  ): Configuration =

    configLoader.configForPlayAppMode[A](mode)
      .map(c => configuration ++ c.asPlayConfig)
      .valueOr(err => throw InitializationError("unable to update Play config", err))

}