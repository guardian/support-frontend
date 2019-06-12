package config

import com.typesafe.config.Config

class GoogleAuth(config: Config) {
  lazy val clientId = {
    println(s"USING CONFIG: ${config}")
    config.getString("clientId")
  }

  lazy val clientSecret = config.getString("clientSecret")

  lazy val redirectUrl = config.getString("redirectUrl")

  lazy val domain = config.getString("domain")
}
