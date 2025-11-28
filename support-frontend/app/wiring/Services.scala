package wiring

import actions.UserFromAuthCookiesActionBuilder.UserClaims
import actions.{UserFromAuthCookiesActionBuilder, UserFromAuthCookiesOrAuthServerActionBuilder}
import admin.settings.AllSettingsProvider
import cats.syntax.either._
import com.gu.aws.AwsS3Client
import com.gu.identity.auth._
import com.gu.okhttp.RequestRunners
import com.gu.support.getaddressio.GetAddressIOService
import com.gu.support.paperround.PaperRoundServiceProvider
import com.gu.support.promotions.PromotionServiceProvider
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.WSClient
import play.api.libs.ws.ahc.AhcWSComponents
import services._
import services.paypal.{PayPalCompletePaymentsServiceProvider, PayPalNvpServiceProvider}
import services.pricing.{DefaultPromotionServiceS3, PriceSummaryServiceProvider}
import services.stepfunctions.{StateWrapper, SupportWorkersClient}
import services.MParticleClient

trait Services {
  self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents with ApplicationConfiguration =>

  implicit val implicitWs: WSClient = wsClient
  implicit private val s3Client: AwsS3Client = AwsS3Client

  lazy val payPalNvpServiceProvider = new PayPalNvpServiceProvider(appConfig.regularPayPalConfigProvider, wsClient)

  lazy val payPalCompletePaymentsServiceProvider =
    new PayPalCompletePaymentsServiceProvider(
      appConfig.payPalCompletePaymentsConfigProvider,
      RequestRunners.futureRunner,
    )

  lazy val identityService = IdentityService(appConfig.identity)

  lazy val userBenefitsApiServiceProvider = new UserBenefitsApiServiceProvider(appConfig.userBenefitsApiConfigProvider)

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

  lazy val asyncAuthenticationService = AsyncAuthenticationService(appConfig.identity, wsClient)

  lazy val oktaAuthService = OktaAuthService[DefaultAccessClaims, UserClaims](
    config = OktaTokenValidationConfig(
      issuerUrl = OktaIssuerUrl(appConfig.identity.oauthIssuerUrl),
      audience = Some(OktaAudience(appConfig.identity.oauthAudience)),
      clientId = Some(OktaClientId(appConfig.identity.oauthClientId)),
    ),
    defaultIdentityClaimsParser = UserClaims.parser,
  )

  lazy val userFromAuthCookiesOrAuthServerActionBuilder = new UserFromAuthCookiesOrAuthServerActionBuilder(
    controllerComponents.parsers.defaultBodyParser,
    oktaAuthService,
    appConfig.identity,
    isAuthServerUp = asyncAuthenticationService.isAuthServerUp,
  )

  lazy val userFromAuthCookiesActionBuilder = new UserFromAuthCookiesActionBuilder(
    controllerComponents.parsers.defaultBodyParser,
    oktaAuthService,
    appConfig.identity,
  )

  lazy val paymentAPIService = new PaymentAPIService(wsClient, appConfig.paymentApiUrl)

  lazy val mparticleClient = new MParticleClient(RequestRunners.futureRunner, appConfig.mparticleConfigProvider)

  lazy val recaptchaService = new RecaptchaService(wsClient)

  lazy val stripeService = new StripeSetupIntentService(appConfig.stage)

  lazy val stripeCheckoutSessionService =
    new StripeCheckoutSessionService(appConfig.stripeConfigProvider, wsClient)

  lazy val landingPageTestService = new LandingPageTestServiceImpl(appConfig.stage)

  lazy val allSettingsProvider: AllSettingsProvider =
    AllSettingsProvider.fromConfig(appConfig, landingPageTestService).valueOr(throw _)

  lazy val defaultPromotionService = new DefaultPromotionServiceS3(s3Client, appConfig.stage, actorSystem)

  lazy val tickerService = new TickerService(appConfig.stage, s3Client)

  lazy val priceSummaryServiceProvider: PriceSummaryServiceProvider =
    new PriceSummaryServiceProvider(appConfig.priceSummaryConfigProvider, defaultPromotionService)

  lazy val getAddressIOService: GetAddressIOService =
    new GetAddressIOService(appConfig.getAddressIOConfig, RequestRunners.futureRunner)

  lazy val paperRoundServiceProvider: PaperRoundServiceProvider =
    new PaperRoundServiceProvider(appConfig.paperRoundConfigProvider)

  lazy val promotionServiceProvider = new PromotionServiceProvider(appConfig.promotionsConfigProvider)

  lazy val prodProductCatalogService: ProdProductCatalogService = new ProdProductCatalogService(
    RequestRunners.futureRunner,
  )
  lazy val codeProductCatalogService: CodeProductCatalogService = new CodeProductCatalogService(
    RequestRunners.futureRunner,
  )

  lazy val cachedProductCatalogServiceProvider: CachedProductCatalogServiceProvider =
    new CachedProductCatalogServiceProvider(
      codeCachedProductCatalogService = new CachedProductCatalogService(actorSystem, codeProductCatalogService),
      prodCachedProductCatalogService = new CachedProductCatalogService(actorSystem, prodProductCatalogService),
    )

}
