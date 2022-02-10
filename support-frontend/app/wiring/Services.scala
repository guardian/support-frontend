package wiring

import admin.settings.AllSettingsProvider
import cats.syntax.either._
import com.gu.aws.AwsS3Client
import com.gu.okhttp.RequestRunners
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.getaddressio.GetAddressIOService
import com.gu.support.pricing.PriceSummaryServiceProvider
import com.gu.support.promotions.PromotionServiceProvider
import com.gu.support.redemption.corporate.{DynamoTableAsyncProvider, RedemptionTable}
import com.gu.zuora.ZuoraGiftLookupServiceProvider
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import services._
import services.paypal.PayPalNvpServiceProvider
import services.stepfunctions.{StateWrapper, SupportWorkersClient}

trait Services {
  self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents with ApplicationConfiguration =>

  implicit private val implicitWs = wsClient
  implicit private val s3Client: AwsS3Client = AwsS3Client

  lazy val payPalNvpServiceProvider = new PayPalNvpServiceProvider(appConfig.regularPayPalConfigProvider, wsClient)

  lazy val identityService = IdentityService(appConfig.identity)

  lazy val goCardlessServiceProvider = new GoCardlessFrontendServiceProvider(appConfig.goCardlessConfigProvider)

  lazy val supportWorkersClient = {
    val stateWrapper = new StateWrapper()
    SupportWorkersClient(
      appConfig.stepFunctionArn,
      stateWrapper,
      appConfig.supportUrl,
      controllers.routes.SupportWorkersStatus.status,
    )
  }

  lazy val capiService = new CapiService(wsClient, appConfig.capiKey)

  lazy val testUsers = TestUserService(appConfig.identity.testUserSecret)

  lazy val asyncAuthenticationService = AsyncAuthenticationService(appConfig.identity, testUsers)

  lazy val paymentAPIService = new PaymentAPIService(wsClient, appConfig.paymentApiUrl)

  lazy val recaptchaService = new RecaptchaService(wsClient)

  lazy val stripeService = new StripeSetupIntentService(appConfig.stage)

  lazy val allSettingsProvider: AllSettingsProvider = AllSettingsProvider.fromConfig(appConfig).valueOr(throw _)

  lazy val priceSummaryServiceProvider: PriceSummaryServiceProvider =
    new PriceSummaryServiceProvider(appConfig.priceSummaryConfigProvider)

  lazy val getAddressIOService: GetAddressIOService =
    new GetAddressIOService(appConfig.getAddressIOConfig, RequestRunners.futureRunner)

  lazy val promotionServiceProvider = new PromotionServiceProvider(appConfig.promotionsConfigProvider)

  val dynamoTableAsyncProvider: DynamoTableAsyncProvider = { isTestUser =>
    RedemptionTable.forEnvAsync(TouchPointEnvironments.fromStage(appConfig.stage, isTestUser))
  }

  lazy val zuoraGiftLookupServiceProvider: ZuoraGiftLookupServiceProvider =
    new ZuoraGiftLookupServiceProvider(appConfig.zuoraConfigProvider, appConfig.stage)

}
