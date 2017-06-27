package com.gu.config

import com.gu.aws.AwsConfig
import com.gu.config.loaders.PrivateConfigLoader
import com.gu.emailservices.EmailServicesConfig
import com.gu.membersDataAPI.{MembersDataServiceConfig, MembersDataServiceConfigProvider}
import com.gu.paypal.PayPalConfigProvider
import com.gu.salesforce.SalesforceConfigProvider
import com.gu.stripe.StripeConfigProvider
import com.gu.zuora.ZuoraConfigProvider
import com.typesafe.config.ConfigValueFactory.fromAnyRef
import com.typesafe.config.{Config, ConfigFactory}
import com.typesafe.scalalogging.LazyLogging

import scala.util.Try

object Configuration extends LazyLogging {
  val loadFromS3: Boolean = Try(Option(System.getenv("GU_SUPPORT_WORKERS_LOAD_S3_CONFIG"))
    .getOrElse("TRUE").toBoolean)
    .getOrElse(true) //Should we load config from S3

  val stage = Stage(Option(System.getenv("GU_SUPPORT_WORKERS_STAGE")).getOrElse(Stages.DEV))
  logger.info(s"Load from S3: $loadFromS3, Stage: $stage")

  val config = PrivateConfigLoader
    .forEnvironment(loadFromS3)
    .load(stage, ConfigFactory.load())

  val awsConfig = AwsConfig.fromConfig(config)
  val stripeConfigProvider = new StripeConfigProvider(stage, config)
  val payPalConfigProvider = new PayPalConfigProvider(stage, config)
  val salesforceConfigProvider = new SalesforceConfigProvider(stage, config)
  val zuoraConfigProvider = new ZuoraConfigProvider(stage, config)
  val emailServicesConfig = EmailServicesConfig.fromConfig(config)
  val membersDataApiConfigProvider = new MembersDataServiceConfigProvider(stage, config)

}

/**
 * Touchpoint represents 3rd party enterprise systems which have a number of different stages or environments (DEV, UAT and PROD)
 * TouchpointConfig abstracts the details of talking to the correct environment based on the user details contained in
 * the request.
 */
trait TouchpointConfig

abstract class TouchpointConfigProvider[T <: TouchpointConfig](defaultStage: Stage, config: Config) {
  private lazy val defaultConfig: T = fromConfig(getTouchpointBackend(defaultStage))
  private lazy val uatConfig: T = fromConfig(getTouchpointBackend(Stages.UAT))

  def get(isTestUser: Boolean = false): T =
    if (isTestUser) uatConfig else defaultConfig

  protected def fromConfig(config: Config): T

  private def getTouchpointBackend(stage: Stage) = config
    .getConfig(s"touchpoint.backend.environments.${stage.name}")
    .withValue("stage", fromAnyRef(stage.name))

}
