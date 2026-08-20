package com.gu.support.config

import com.typesafe.config.Config

case class SalesTaxApiConfig(baseUrl: String, apiKey: String)

object SalesTaxApiConfig {
  def fromConfig(config: Config): SalesTaxApiConfig =
    SalesTaxApiConfig(
      config.getString("salesTaxApi.url"),
      config.getString("salesTaxApi.key"),
    )
}
