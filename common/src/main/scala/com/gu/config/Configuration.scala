package com.gu.config

import com.gu.config.loaders.ConfigLoader
import com.typesafe.scalalogging.LazyLogging

object Configuration extends LazyLogging{
  val environment = Environment(System.getenv("GU_SUPPORT_WORKERS_STAGE")) //Used to check if we are running locally
  val stage = Environments.getStage(environment)
  logger.info(s"Stage: $stage")

  val config = ConfigLoader.fromEnvironment(environment).load()

  logger.info(s"Config: $config")
  val backend = config.getConfig("touchpoint.backend.environments.DEV")
  val stripeCredentials = StripeCredentials(
    secretKey = backend.getString(s"stripe.api.key.secret"),
    publicKey = backend.getString(s"stripe.api.key.public")
  )
}
