package com.gu.support.config

import com.typesafe.config.Config

case class GetAddressIOConfig(apiUrl: String, apiKey: String)

object GetAddressIOConfig {
  def fromConfig(config: Config): GetAddressIOConfig =
    GetAddressIOConfig(
      config.getString("get-address-io-api.url"),
      config.getString("get-address-io-api.key"),
    )
}
