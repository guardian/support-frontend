package com.gu.config

import com.gu.config.loaders.PrivateConfigLoader
import com.gu.paypal.PayPalConfig
import com.gu.stripe.StripeConfig
import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging

import scala.util.Try

object Configuration extends LazyLogging{
  val loadFromS3 : Boolean = Try(Option(System.getenv("GU_SUPPORT_WORKERS_LOAD_S3_CONFIG")).getOrElse("TRUE").toBoolean).getOrElse(true) //Should we load config from S3
  val stage = Stage(Option(System.getenv("GU_SUPPORT_WORKERS_STAGE")).getOrElse(Stages.DEV))
  logger.info(s"local: $loadFromS3, Stage: $stage")


  val config = PrivateConfigLoader
    .forEnvironment(loadFromS3)
    .load(stage, ConfigFactory.load())

  val backend = config.getConfig(s"touchpoint.backend.environments.${stage.name}")

  val stripeConfig =  StripeConfig.fromConfig(backend)
  val payPalConfig = PayPalConfig.fromConfig(backend, stage)
}
