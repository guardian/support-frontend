package config

import com.typesafe.config.ConfigFactory

class CopyConfig {
  val config = ConfigFactory.load("copy.conf")

  val bundleLandingDescription = config.getString("copy.bundleLanding.description")
}
