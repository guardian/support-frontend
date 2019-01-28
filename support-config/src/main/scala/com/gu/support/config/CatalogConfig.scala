package com.gu.support.config

import com.typesafe.config.Config

case class CatalogConfig(environment: TouchPointEnvironment) extends TouchpointConfig

class CatalogConfigProvider(config: Config, defaultStage: Stage)
  extends TouchpointConfigProvider[CatalogConfig](config, defaultStage) {
  override protected def fromConfig(config: Config) = CatalogConfig.fromConfig(config)
}

object CatalogConfig{
  def fromConfig(config: Config) = CatalogConfig(
    TouchPointEnvironments.fromString(config.getString("environment"))
  )
}

