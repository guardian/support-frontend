package com.gu.support.config

import com.typesafe.config.Config

case class CatalogConfig(environment: TouchPointEnvironment)
class CatalogConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[CatalogConfig](config, defaultStage) {
  override protected def fromConfig(config: Config): CatalogConfig = CatalogConfig.fromConfig(config)
}

object CatalogConfig {
  def fromConfig(config: Config): CatalogConfig = CatalogConfig(
    TouchPointEnvironments.fromString(config.getString("environment")),
  )
}
