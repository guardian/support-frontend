package config

import com.typesafe.config.ConfigFactory
import config.ConfigImplicits._
import com.typesafe.config.Config

class StringsConfig {
  val config: Config = ConfigFactory.load("strings.conf")

  val contributionsLandingDescription: Option[String] = config.getOptionalString("contributionsLanding.description")
  val subscriptionsLandingDescription: Option[String] = config.getOptionalString("subscriptionsLanding.description")
  val digitalPackLandingDescription: Option[String] = config.getOptionalString("digitalPackLanding.description")
  val weeklyLandingDescription: Option[String] = config.getOptionalString("weeklyLanding.description")
  val paperLandingDescription: Option[String] = config.getOptionalString("paperLanding.description")
}
