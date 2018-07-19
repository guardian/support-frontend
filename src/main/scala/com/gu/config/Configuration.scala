package com.gu.config

import com.gu.config.loaders.PrivateConfigLoader
import com.gu.monitoring.SafeLogger
import com.gu.salesforce.SalesforceConfigProvider
import com.gu.support.config._
import com.gu.zuora.ZuoraConfigProvider
import com.typesafe.config.ConfigFactory

import scala.util.Try

object Configuration {
  val loadFromS3: Boolean = Try(Option(System.getenv("GU_SUPPORT_WORKERS_LOAD_S3_CONFIG"))
    .getOrElse("TRUE").toBoolean)
    .getOrElse(true) //Should we load config from S3

  val stage = Stage.fromString(Option(System.getenv("GU_SUPPORT_WORKERS_STAGE"))
    .getOrElse("DEV"))
    .getOrElse(Stages.DEV)

  SafeLogger.info(s"Load from S3: $loadFromS3, Stage: $stage")

  val config = PrivateConfigLoader
    .forEnvironment(loadFromS3)
    .load(stage, ConfigFactory.load())

  val encryptionKeyId = config.getString("aws.encryptionKeyId")
  val stripeConfigProvider = new StripeConfigProvider(config, stage)
  val payPalConfigProvider = new PayPalConfigProvider(config, stage)
  val salesforceConfigProvider = new SalesforceConfigProvider(config, stage)
  val zuoraConfigProvider = new ZuoraConfigProvider(config, stage)
}
