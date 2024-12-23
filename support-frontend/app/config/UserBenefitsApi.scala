package config

import com.typesafe.config.Config

class UserBenefitsApi(config: Config) {
  lazy val host = config.getString("host")
  lazy val apiKey = config.getString("apiKey")
}
