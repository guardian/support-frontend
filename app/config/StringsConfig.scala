package config

import com.typesafe.config.ConfigFactory

class StringsConfig {
  val config = ConfigFactory.load("strings.conf")

  val bundleLandingDescription = config.getString("bundleLanding.description")
  val contributionLandingDescription = config.getString("contributionLanding.description")
}
