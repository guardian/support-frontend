package config

import com.typesafe.config.ConfigFactory

class StringsConfig {
  val config = ConfigFactory.load("strings.conf")

  val supportLandingDescription = config.getString("supportLanding.description")
  val contributionLandingDescription = config.getString("contributionLanding.description")
}
