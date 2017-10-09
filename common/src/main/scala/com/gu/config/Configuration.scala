package com.gu.config

import com.gu.config.loaders.PrivateConfigLoader
import com.gu.emailservices.EmailServicesConfig
import com.gu.membersDataAPI.MembersDataServiceConfigProvider
import com.gu.salesforce.SalesforceConfigProvider
import com.gu.support.config._
import com.gu.zuora.ZuoraConfigProvider
import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging

import scala.util.Try

object Configuration extends LazyLogging {
  val loadFromS3: Boolean = Try(Option(System.getenv("GU_SUPPORT_WORKERS_LOAD_S3_CONFIG"))
    .getOrElse("TRUE").toBoolean)
    .getOrElse(true) //Should we load config from S3

  val stage = Stage.fromString(Option(System.getenv("GU_SUPPORT_WORKERS_STAGE"))
    .getOrElse("DEV"))
    .getOrElse(Stages.DEV)

  logger.info(s"Load from S3: $loadFromS3, Stage: $stage")

  val config = PrivateConfigLoader
    .forEnvironment(loadFromS3)
    .load(stage, ConfigFactory.load())

  val encryptionKeyId = config.getString("aws.encryptionKeyId")
  val stripeConfigProvider = new StripeConfigProvider(config, stage)
  val payPalConfigProvider = new PayPalConfigProvider(config, stage)
  val salesforceConfigProvider = new SalesforceConfigProvider(config, stage)
  val zuoraConfigProvider = new ZuoraConfigProvider(config, stage)
  val emailServicesConfig = EmailServicesConfig.fromConfig(config)
  val membersDataApiConfigProvider = new MembersDataServiceConfigProvider(config, stage)
}