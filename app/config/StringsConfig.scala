package config

import com.typesafe.config.ConfigFactory

class StringsConfig {
  val config = ConfigFactory.load("strings.conf")

  val bundleLandingDescription = config.getString("copy.bundleLanding.description")
}
