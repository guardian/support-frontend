package com.gu.services

import com.gu.acquisitions.GoogleAnalyticsServiceBuilder
import com.gu.config.Configuration
import com.gu.config.Configuration._
import com.gu.gocardless.GoCardlessWorkersService
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.paypal.PayPalService
import com.gu.salesforce.SalesforceService
import com.gu.stripe.StripeService
import com.gu.support.acquisitions.{
  AcquisitionsStreamLambdaConfig,
  AcquisitionsStreamService,
  AcquisitionsStreamServiceImpl,
  BigQueryService,
}
import com.gu.support.catalog.CatalogService
import com.gu.support.config.Stages.{CODE, DEV, PROD}
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.promotions.PromotionService
import com.gu.support.redemption.gifting.generator.GiftCodeGeneratorService
import com.gu.zuora.{ZuoraGiftService, ZuoraService}
import com.gu.supporterdata.model.Stage.{DEV => DynamoStageDEV, PROD => DynamoStagePROD}
import com.gu.supporterdata.services.SupporterDataDynamoService

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

trait ServiceProvider {
  private lazy val config = Configuration.load()
  private lazy val defaultServices: Services = new Services(false, config)
  private lazy val testServices: Services = new Services(true, config)
  def forUser(isTestUser: Boolean): Services = if (isTestUser) testServices else defaultServices
}

object ServiceProvider extends ServiceProvider

class Services(isTestUser: Boolean, val config: Configuration) {
  import config._

  lazy val stripeService: StripeService =
    new StripeService(stripeConfigProvider.get(isTestUser), configurableFutureRunner(40.seconds))
  lazy val payPalService: PayPalService =
    new PayPalService(payPalConfigProvider.get(isTestUser), configurableFutureRunner(40.seconds))
  lazy val salesforceService =
    new SalesforceService(salesforceConfigProvider.get(isTestUser), configurableFutureRunner(40.seconds))
  lazy val zuoraService = new ZuoraService(zuoraConfigProvider.get(isTestUser), configurableFutureRunner(60.seconds))
  lazy val zuoraGiftService =
    new ZuoraGiftService(zuoraConfigProvider.get(isTestUser), Configuration.stage, configurableFutureRunner(60.seconds))
  lazy val gaService = GoogleAnalyticsServiceBuilder.build(isTestUser)
  lazy val promotionService = new PromotionService(promotionsConfigProvider.get(isTestUser))
  lazy val goCardlessService = GoCardlessWorkersService(goCardlessConfigProvider.get(isTestUser))
  lazy val catalogService = CatalogService(TouchPointEnvironments.fromStage(stage, isTestUser))
  lazy val giftCodeGenerator = new GiftCodeGeneratorService
  lazy val bigQueryService = new BigQueryService(bigQueryConfigProvider.get(isTestUser))
  lazy val acquisitionsStreamService: AcquisitionsStreamService = new AcquisitionsStreamServiceImpl(
    AcquisitionsStreamLambdaConfig(config.acquisitionsKinesisStreamName),
  )
  val supporterDynamoStage = (Configuration.stage, isTestUser) match {
    case (PROD, false) => DynamoStagePROD
    case _ => DynamoStageDEV
  }
  lazy val supporterDataDynamoService = SupporterDataDynamoService(supporterDynamoStage)
}
