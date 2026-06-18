package com.gu.support.config

case class IdealPostcodesConfig(apiKey: String)

object IdealPostcodesConfig {
  import com.typesafe.config.Config

  def fromConfig(config: Config): IdealPostcodesConfig =
    IdealPostcodesConfig(
      config.getString("ideal-postcodes-api.key"),
    )
}
