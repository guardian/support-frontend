package com.gu.support.config

import TouchPointEnvironments.{SANDBOX, fromStage}
import com.typesafe.config.{Config, ConfigValueFactory}

/** Touchpoint represents 3rd party enterprise systems which have a number of different stages or environments (DEV, and
  * PROD) TouchpointConfig abstracts the details of talking to the correct environment based on the user details
  * contained in the request.
  */

abstract class TouchpointConfigProvider[T](config: Config, defaultStage: Stage) {

  private lazy val defaultConfig: T = fromConfig(getTouchpointBackend(fromStage(defaultStage)))
  private lazy val testConfig: T = fromConfig(getTouchpointBackend(SANDBOX))

  def get(isTestUser: Boolean = false): T =
    if (isTestUser) testConfig else defaultConfig

  protected def fromConfig(config: Config): T

  private def getTouchpointBackend(environment: TouchPointEnvironment) =
    config
      .getConfig(s"touchpoint.backend.environments.${environment.envValue}")
      .withValue("environment", ConfigValueFactory.fromAnyRef(environment.envValue))
}
