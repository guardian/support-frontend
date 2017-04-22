package com.gu.config

import com.gu.config.loaders.PrivateConfigLoader
import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging

import scala.util.Try

object Configuration extends LazyLogging{
  val local : Boolean = Try(Option(System.getenv("GU_SUPPORT_WORKERS_LOCAL")).getOrElse("FALSE").toBoolean).getOrElse(false) //Used to check if we are running locally
  val stage = Stage(Option(System.getenv("GU_SUPPORT_WORKERS_STAGE")).getOrElse(Stages.DEV))
  logger.info(s"local: $local, Stage: $stage")


  val config = PrivateConfigLoader
    .forEnvironment(local)
    .load(stage, ConfigFactory.load())

  logger.info(s"Config: $config")
  val backend = config.getConfig(s"touchpoint.backend.environments.${stage.name}")
  val stripeCredentials = StripeCredentials(
    secretKey = backend.getString(s"stripe.api.key.secret"),
    publicKey = backend.getString(s"stripe.api.key.public")
  )
}
