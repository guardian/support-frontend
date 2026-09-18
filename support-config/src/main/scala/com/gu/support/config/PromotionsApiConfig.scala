package com.gu.support.config

import com.typesafe.config.Config

case class PromotionsApiConfig(environment: TouchPointEnvironment, url: String, apiKey: String)

class PromotionsApiConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[PromotionsApiConfig](config, defaultStage) {
  override protected def fromConfig(config: Config): PromotionsApiConfig = PromotionsApiConfig.fromConfig(config)
}

object PromotionsApiConfig {
  def fromConfig(config: Config): PromotionsApiConfig =
    PromotionsApiConfig(
      TouchPointEnvironments.fromString(config.getString("environment")),
      config.getString("promotionsApi.url"),
      config.getString("promotionsApi.key"),
    )
}
