package config

import com.gu.support.config.{PayPalConfigProvider, Stage, StripeConfigProvider}
import com.typesafe.config.ConfigFactory
import config.ConfigImplicits._
import services.GoCardlessConfigProvider
import services.aws.AwsConfig
import com.amazonaws.services.s3.AmazonS3
import services.stepfunctions.StateMachineArn
import admin.AdminSettings
import cats.syntax.either._

class Configuration(implicit s3: AmazonS3) {
  val config = ConfigFactory.load()

  lazy val stage = Stage.fromString(config.getString("stage")).get

  lazy val sentryDsn = config.getOptionalString("sentry.dsn")

  lazy val identity = new Identity(config.getConfig("identity"))

  lazy val googleAuth = new GoogleAuth(config.getConfig("googleAuth"))

  lazy val aws = new AwsConfig(config.getConfig("aws"))

  lazy val guardianDomain = config.getString("guardianDomain")

  lazy val supportUrl = config.getString("support.url")

  lazy val paymentApiUrl = config.getString("paymentApi.url")

  lazy val membersDataServiceApiUrl = config.getString("membersDataService.api.url")

  lazy val goCardlessConfigProvider = new GoCardlessConfigProvider(config, stage)

  lazy val regularPayPalConfigProvider = new PayPalConfigProvider(config, stage)

  lazy val regularStripeConfigProvider = new StripeConfigProvider(config, stage)

  lazy val oneOffStripeConfigProvider = new StripeConfigProvider(config, stage, "oneOffStripe")

  lazy val stepFunctionArn = StateMachineArn.fromString(config.getString("supportWorkers.arn")).get

  implicit val settings = AdminSettings.fromDiskOrS3(config).valueOr(throw _)

}
