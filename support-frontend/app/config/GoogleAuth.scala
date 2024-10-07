package config

import com.typesafe.config.Config

class GoogleAuth(config: Config) {
  lazy val clientId: String = config.getString("clientId")

  lazy val clientSecret: String = config.getString("clientSecret")

  lazy val redirectUrl: String = config.getString("redirectUrl")

  lazy val domain: String = config.getString("domain")
}
