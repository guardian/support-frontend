package com.gu.support.config

import com.typesafe.config.Config

case class GoCardlessConfig(
    apiToken: String,
    environment: String,
)
class GoCardlessConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[GoCardlessConfig](config, defaultStage) {
  def fromConfig(config: Config): GoCardlessConfig = {
    GoCardlessConfig(
      config.getString("gocardless.token"),
      config.getString("gocardless.environment"),
    )
  }
}
