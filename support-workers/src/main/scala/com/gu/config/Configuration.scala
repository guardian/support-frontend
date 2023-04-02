package com.gu.config

import com.gu.acquisitions.BigQueryConfigProvider
import com.gu.config.loaders.PrivateConfigLoader
import com.gu.monitoring.SafeLogger
import com.gu.salesforce.SalesforceConfigProvider
import com.gu.support.config._
import com.typesafe.config.{Config, ConfigFactory}

import scala.util.Try

object Configuration {

  def load(): Configuration = new Configuration(loadConfig)

  val loadFromS3: Boolean = Try(
    Option(System.getenv("GU_SUPPORT_WORKERS_LOAD_S3_CONFIG"))
      .getOrElse("TRUE")
      .toBoolean,
  )
    .getOrElse(true) // Should we load config from S3

  val stage = Stage
    .fromString(
      Option(System.getenv("GU_SUPPORT_WORKERS_STAGE"))
        .getOrElse("DEV"),
    )
    .getOrElse(Stages.DEV)

  SafeLogger.info(s"Load from S3: $loadFromS3, Stage: $stage")

  // this is static so it persists between lambda executions, but lazy so it doesn't cause a fatal error at class loading time
  private lazy val loadConfig = PrivateConfigLoader
    .forEnvironment(Configuration.loadFromS3)
    .load(Configuration.stage, ConfigFactory.load(this.getClass.getClassLoader))

  lazy val emailQueueName = System.getenv("EMAIL_QUEUE_NAME")
}

case class Configuration(config: Config) {

  import Configuration.stage

  val stripeConfigProvider = new StripeConfigProvider(config, stage)
  val payPalConfigProvider = new PayPalConfigProvider(config, stage)
  val salesforceConfigProvider = new SalesforceConfigProvider(config, stage)
  val zuoraConfigProvider = new ZuoraConfigProvider(config, stage)
  val promotionsConfigProvider = new PromotionsConfigProvider(config, stage)
  val goCardlessConfigProvider = new GoCardlessConfigProvider(config, stage)
  val bigQueryConfigProvider = new BigQueryConfigProvider(config, stage)

  val acquisitionsKinesisStreamName = config.getString("kinesis.streamName")
}
