package config

import admin.{SettingsSource, SettingsSources}
import cats.syntax.either._
import com.gu.support.config.{PayPalConfigProvider, PromotionsConfigProvider, Stage, StripeConfigProvider}
import com.typesafe.config.ConfigFactory
import config.ConfigImplicits._
import config.Configuration.GuardianDomain
import services.GoCardlessConfigProvider
import services.aws.AwsConfig
import services.stepfunctions.StateMachineArn

class Configuration {
  val config = ConfigFactory.load()

  lazy val stage = Stage.fromString(config.getString("stage")).get

  lazy val sentryDsn = config.getOptionalString("sentry.dsn")

  lazy val identity = new Identity(config.getConfig("identity"))

  lazy val googleAuth = new GoogleAuth(config.getConfig("googleAuth"))

  lazy val aws = new AwsConfig(config.getConfig("aws"))

  lazy val guardianDomain = GuardianDomain(config.getString("guardianDomain"))

  lazy val supportUrl = config.getString("support.url")

  lazy val paymentApiUrl = config.getString("paymentApi.url")

  lazy val membersDataServiceApiUrl = config.getString("membersDataService.api.url")

  lazy val goCardlessConfigProvider = new GoCardlessConfigProvider(config, stage)

  lazy val regularPayPalConfigProvider = new PayPalConfigProvider(config, stage)

  lazy val regularStripeConfigProvider = new StripeConfigProvider(config, stage)

  lazy val oneOffStripeConfigProvider = new StripeConfigProvider(config, stage, "oneOffStripe")

  lazy val stepFunctionArn = StateMachineArn.fromString(config.getString("supportWorkers.arn")).get

  lazy val settingsSources: SettingsSources = SettingsSources.fromConfig(config).valueOr(throw _)

  lazy val fastlyConfig: Option[FastlyConfig] = FastlyConfig.fromConfig(config).valueOr(throw _)

  lazy val promotionsConfigProvider = new PromotionsConfigProvider(config, stage)
}

object Configuration {
  case class GuardianDomain(value: String)
}
