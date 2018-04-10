package config

import com.typesafe.config.ConfigFactory

class StringsConfig {
  val config = ConfigFactory.load("strings.conf")

  val supportLandingDescription = config.getString("supportLanding.description")
  val contributionsLandingDescription = config.getString("contributionsLanding.description")
  val subscriptionsLandingDescription = config.getString("subscriptionsLanding.description")
}
