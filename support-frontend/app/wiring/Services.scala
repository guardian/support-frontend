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
import com.gu.zuora.ZuoraGiftLookupServiceProvider
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.WSClient
import play.api.libs.ws.ahc.AhcWSComponents
import services._
import services.paypal.PayPalNvpServiceProvider
import services.pricing.{DefaultPromotionServiceS3, PriceSummaryServiceProvider}
import services.stepfunctions.{StateWrapper, SupportWorkersClient}

trait Services {
  self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents with ApplicationConfiguration =>

  implicit val implicitWs: WSClient = wsClient
  implicit private val s3Client: AwsS3Client = AwsS3Client

  lazy val payPalNvpServiceProvider: PayPalNvpServiceProvider =
    new PayPalNvpServiceProvider(appConfig.regularPayPalConfigProvider, wsClient)

  lazy val identityService: IdentityService = IdentityService(appConfig.identity)

  lazy val goCardlessServiceProvider: GoCardlessFrontendServiceProvider = new GoCardlessFrontendServiceProvider(
    appConfig.goCardlessConfigProvider,
  )

  lazy val supportWorkersClient: SupportWorkersClient = {
    val stateWrapper = new StateWrapper()
    SupportWorkersClient(
      appConfig.stepFunctionArn,
      stateWrapper,
      appConfig.supportUrl,
      controllers.routes.SupportWorkersStatus.status,
    )
  }

  lazy val capiService: CapiService = new CapiService(wsClient, appConfig.capiKey)

  lazy val testUsers: TestUserService = TestUserService(appConfig.identity.testUserSecret)

  lazy val asyncAuthenticationService: AsyncAuthenticationService =
    AsyncAuthenticationService(appConfig.identity, wsClient)

  lazy val oktaAuthService: OktaAuthService[DefaultAccessClaims, UserClaims] =
    OktaAuthService[DefaultAccessClaims, UserClaims](
      config = OktaTokenValidationConfig(
        issuerUrl = OktaIssuerUrl(appConfig.identity.oauthIssuerUrl),
        audience = Some(OktaAudience(appConfig.identity.oauthAudience)),
        clientId = Some(OktaClientId(appConfig.identity.oauthClientId)),
      ),
      defaultIdentityClaimsParser = UserClaims.parser,
    )

  lazy val userFromAuthCookiesOrAuthServerActionBuilder: UserFromAuthCookiesOrAuthServerActionBuilder =
    new UserFromAuthCookiesOrAuthServerActionBuilder(
      controllerComponents.parsers.defaultBodyParser,
      oktaAuthService,
      appConfig.identity,
      isAuthServerUp = asyncAuthenticationService.isAuthServerUp,
    )

  lazy val userFromAuthCookiesActionBuilder: UserFromAuthCookiesActionBuilder = new UserFromAuthCookiesActionBuilder(
    controllerComponents.parsers.defaultBodyParser,
    oktaAuthService,
    appConfig.identity,
  )

  lazy val paymentAPIService: PaymentAPIService = new PaymentAPIService(wsClient, appConfig.paymentApiUrl)

  lazy val recaptchaService: RecaptchaService = new RecaptchaService(wsClient)

  lazy val stripeService: StripeSetupIntentService = new StripeSetupIntentService(appConfig.stage)

  lazy val allSettingsProvider: AllSettingsProvider = AllSettingsProvider.fromConfig(appConfig).valueOr(throw _)

  lazy val defaultPromotionService: DefaultPromotionServiceS3 =
    new DefaultPromotionServiceS3(s3Client, appConfig.stage, actorSystem)

  lazy val priceSummaryServiceProvider: PriceSummaryServiceProvider =
    new PriceSummaryServiceProvider(appConfig.priceSummaryConfigProvider, defaultPromotionService)

  lazy val getAddressIOService: GetAddressIOService =
    new GetAddressIOService(appConfig.getAddressIOConfig, RequestRunners.futureRunner)

  lazy val paperRoundServiceProvider: PaperRoundServiceProvider =
    new PaperRoundServiceProvider(appConfig.paperRoundConfigProvider)

  lazy val promotionServiceProvider: PromotionServiceProvider = new PromotionServiceProvider(
    appConfig.promotionsConfigProvider,
  )

  lazy val zuoraGiftLookupServiceProvider: ZuoraGiftLookupServiceProvider =
    new ZuoraGiftLookupServiceProvider(appConfig.zuoraConfigProvider, appConfig.stage)

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
