package com.gu.support.config

import com.typesafe.config.Config

case class PaperRoundConfig(apiUrl: String, apiKey: String)

class PaperRoundConfigProvider(config: Config, defaultStage: Stage)
    extends TouchpointConfigProvider[PaperRoundConfig](config, defaultStage) {
  def fromConfig(config: Config): PaperRoundConfig =
    PaperRoundConfig(
      config.getString("paper-round-api.url"),
      config.getString("paper-round-api.key"),
    )
}
