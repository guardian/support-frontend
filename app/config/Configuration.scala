package config

import com.gu.support.config.{PayPalConfigProvider, Stage, StripeConfigProvider}
import com.typesafe.config.ConfigFactory
import config.ConfigImplicits._
import services.aws.AwsConfig

class Configuration {
  val config = ConfigFactory.load()

  lazy val stage = Stage.fromString(config.getString("stage")).get

  lazy val sentryDsn = config.getOptionalString("sentry.dsn")

  lazy val identity = new Identity(config.getConfig("identity"))

  lazy val googleAuth = new GoogleAuth(config.getConfig("googleAuth"))

  lazy val aws = new AwsConfig(config.getConfig("aws"))

  lazy val guardianDomain = config.getString("guardianDomain")

  lazy val supportUrl = config.getString("support.url")

  lazy val contributionsStripeEndpoint = config.getString("contributions.stripe.url")

  lazy val contributionsPayPalEndpoint = config.getString("contributions.paypal.url")

  lazy val membersDataServiceApiUrl = config.getString("membersDataService.api.url")

  lazy val payPalConfigProvider = new PayPalConfigProvider(config, stage)

  lazy val stripeConfigProvider = new StripeConfigProvider(config, stage)

  lazy val oneOffStripeConfigProvider = new StripeConfigProvider(config, stage, "oneOffStripe")
}
