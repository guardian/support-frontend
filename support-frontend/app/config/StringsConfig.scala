package config

import com.typesafe.config.ConfigFactory
import config.ConfigImplicits._

class StringsConfig {
  val config = ConfigFactory.load("strings.conf")

  val contributionsLandingDescription = config.getOptionalString("contributionsLanding.description")
  val subscriptionsLandingDescription = config.getOptionalString("subscriptionsLanding.description")
  val digitalPackLandingDescription = config.getOptionalString("digitalPackLanding.description")
  val weeklyLandingDescription = config.getOptionalString("weeklyLanding.description")
  val paperLandingDescription = config.getOptionalString("paperLanding.description")
}
