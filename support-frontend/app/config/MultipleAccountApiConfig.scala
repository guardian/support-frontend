package config

import com.typesafe.config.Config

case class MultipleAccountApiConfig(baseUrl: String, apiKey: String)

object MultipleAccountApiConfig {
  def fromConfig(config: Config): MultipleAccountApiConfig =
    MultipleAccountApiConfig(
      config.getString("multipleAccountsApi.url"),
      config.getString("multipleAccountsApi.key"),
    )
}
