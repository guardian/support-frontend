package config

import com.typesafe.config.ConfigFactory
import ConfigImplicits._
import services.aws.AwsConfig

class Configuration {
  val config = ConfigFactory.load()

  lazy val stage = Stage.fromString(config.getString("stage")).get

  lazy val sentryDsn = config.getOptionalString("sentry.dsn")

  lazy val identity = new Identity(config.getConfig("identity"))

  lazy val googleAuth = new GoogleAuth(config.getConfig("googleAuth"))

  lazy val aws = new AwsConfig(config.getConfig("aws"))

  lazy val supportUrl = config.getString("support.url")

  lazy val membersDataServiceApiUrl = config.getString("membersDataService.api.url")

  lazy val touchpointConfigProvider = new TouchpointConfigProvider(
    config.getConfig("touchpoint.backend.environments"),
    stage
  )
}