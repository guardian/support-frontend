package com.gu.support.config

import com.typesafe.config.Config

case class TaxRateConfig(baseUrl: String, apiKey: String)

object TaxRateConfig {
  def fromConfig(config: Config): TaxRateConfig =
    TaxRateConfig(
      config.getString("taxRateApi.url"),
      config.getString("taxRateApi.key"),
    )
}
