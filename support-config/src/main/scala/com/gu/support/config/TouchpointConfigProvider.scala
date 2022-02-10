package com.gu.support.config

import TouchPointEnvironments.{UAT, fromStage}
import com.typesafe.config.{Config, ConfigValueFactory}

/** Touchpoint represents 3rd party enterprise systems which have a number of different stages or environments (DEV, UAT
  * and PROD) TouchpointConfig abstracts the details of talking to the correct environment based on the user details
  * contained in the request.
  */

abstract class TouchpointConfigProvider[T](config: Config, defaultStage: Stage) {

  private lazy val defaultConfig: T = fromConfig(getTouchpointBackend(fromStage(defaultStage)))
  private lazy val uatConfig: T = fromConfig(getTouchpointBackend(UAT))

  def get(isTestUser: Boolean = false): T =
    if (isTestUser) uatConfig else defaultConfig

  protected def fromConfig(config: Config): T

  private def getTouchpointBackend(environment: TouchPointEnvironment) =
    config
      .getConfig(s"touchpoint.backend.environments.${environment.toString}")
      .withValue("environment", ConfigValueFactory.fromAnyRef(environment.toString))
}
