package com.gu.support.config

import com.typesafe.config.Config

case class PaperRoundConfig(apiUrl: String, apiKey: String)

object PaperRoundConfig {
  def fromConfig(config: Config): PaperRoundConfig =
    PaperRoundConfig(
      config.getString("paper-round-api.url"),
      config.getString("paper-round-api.key"),
    )
}
