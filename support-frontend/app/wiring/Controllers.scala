package wiring

import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricSetup.setupWarningRequest
import controllers._
import lib.ErrorController
import play.api.BuiltInComponentsFromContext

trait Controllers {

  self: AssetsComponents
    with Services
    with BuiltInComponentsFromContext
    with ApplicationConfiguration
    with ActionBuilders
    with wiring.Assets
    with PlayComponents
    with GoogleAuth =>

  lazy val assetController: Assets = new controllers.Assets(httpErrorHandler, assetsMetadata)
  lazy val faviconController: Favicon =
    new controllers.Favicon(actionBuilders, appConfig.stage)(fileMimeTypes, implicitly)
  def errorController: ErrorController

  lazy val applicationController: Application = new Application(
    actionBuilders,
    assetsResolver,
    testUsers,
    controllerComponents,
    appConfig.oneOffStripeConfigProvider,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    appConfig.amazonPayConfigProvider,
    appConfig.recaptchaConfigProvider,
    paymentAPIService,
    appConfig.membersDataServiceApiUrl,
    stringsConfig,
    allSettingsProvider,
    appConfig.stage,
    priceSummaryServiceProvider,
    cachedProductCatalogServiceProvider,
    appConfig.supportUrl,
  )

  lazy val diagnosticsController: DiagnosticsController = new DiagnosticsController(
    actionBuilders,
  )

  lazy val articleShareController: ArticleShare = new ArticleShare(
    actionBuilders,
    controllerComponents,
    capiService,
  )

  lazy val subscriptionsController: SubscriptionsController = new SubscriptionsController(
    actionBuilders,
    priceSummaryServiceProvider,
    assetsResolver,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
  )

  lazy val redemptionController: RedemptionController = new RedemptionController(
    actionBuilders,
    assetsResolver,
    allSettingsProvider,
    testUsers,
    controllerComponents,
    zuoraGiftLookupServiceProvider,
  )

  private lazy val landingCopyProvider = new LandingCopyProvider(
    promotionServiceProvider,
    appConfig.stage,
  )

  lazy val digitalPackController: DigitalSubscriptionController = new DigitalSubscriptionController(
    priceSummaryServiceProvider,
    landingCopyProvider,
    assetsResolver,
    actionBuilders,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    appConfig.recaptchaConfigProvider,
    cachedProductCatalogServiceProvider,
    appConfig.stage,
    testUsers,
    appConfig.supportUrl,
  )

  lazy val paperController: PaperSubscriptionController = new PaperSubscriptionController(
    priceSummaryServiceProvider,
    landingCopyProvider,
    assetsResolver,
    actionBuilders,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
  )

  lazy val weeklyController: WeeklySubscriptionController = new WeeklySubscriptionController(
    priceSummaryServiceProvider,
    landingCopyProvider,
    assetsResolver,
    actionBuilders,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
  )

  lazy val digitalPackFormController: DigitalSubscriptionFormController = new DigitalSubscriptionFormController(
    priceSummaryServiceProvider,
    assetsResolver,
    actionBuilders,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    appConfig.recaptchaConfigProvider,
    cachedProductCatalogServiceProvider,
    appConfig.stage,
  )

  lazy val paperFormController: PaperSubscriptionFormController = new PaperSubscriptionFormController(
    priceSummaryServiceProvider,
    assetsResolver,
    actionBuilders,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    appConfig.recaptchaConfigProvider,
    cachedProductCatalogServiceProvider,
    appConfig.stage,
  )

  lazy val weeklyFormController: WeeklySubscriptionFormController = new WeeklySubscriptionFormController(
    priceSummaryServiceProvider,
    assetsResolver,
    actionBuilders,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    appConfig.recaptchaConfigProvider,
    cachedProductCatalogServiceProvider,
    appConfig.stage,
  )

  lazy val createSubscriptionController: CreateSubscriptionController = new CreateSubscriptionController(
    supportWorkersClient,
    actionBuilders,
    identityService,
    recaptchaService = recaptchaService,
    recaptchaConfigProvider = appConfig.recaptchaConfigProvider,
    allSettingsProvider,
    testUsers,
    controllerComponents,
    appConfig.guardianDomain,
    paperRoundServiceProvider,
  )

  lazy val supportWorkersStatusController: SupportWorkersStatus = new SupportWorkersStatus(
    supportWorkersClient,
    controllerComponents,
    actionBuilders,
  )

  lazy val stripeController: StripeController = new StripeController(
    components = controllerComponents,
    actionRefiners = actionBuilders,
    recaptchaService = recaptchaService,
    stripeService = stripeService,
    recaptchaConfigProvider = appConfig.recaptchaConfigProvider,
    allSettingsProvider,
    appConfig.stage,
  )

  lazy val payPalRegularController: PayPalRegular = new PayPalRegular(
    actionBuilders,
    assetsResolver,
    payPalNvpServiceProvider,
    testUsers,
    controllerComponents,
    allSettingsProvider,
  )

  lazy val payPalOneOffController: PayPalOneOff = new PayPalOneOff(
    actionBuilders,
    assetsResolver,
    testUsers,
    controllerComponents,
    paymentAPIService,
    allSettingsProvider,
  )

  lazy val testUsersController: TestUsersManagement = new TestUsersManagement(
    authAction,
    controllerComponents,
    testUsers,
    appConfig.supportUrl,
    appConfig.guardianDomain,
  )

  lazy val authCodeFlowController: AuthCodeFlowController =
    new AuthCodeFlowController(controllerComponents, asyncAuthenticationService, appConfig.identity)

  lazy val siteMapController: SiteMap = new SiteMap(
    actionBuilders,
    controllerComponents,
  )

  lazy val identityController: IdentityController = new IdentityController(
    identityService,
    controllerComponents,
    actionBuilders,
    appConfig.identity.webappUrl,
    () => AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(setupWarningRequest(appConfig.stage)),
  )

  lazy val directDebitController: DirectDebit = new DirectDebit(
    actionBuilders,
    controllerComponents,
    goCardlessServiceProvider,
    testUsers,
  )

  lazy val getAddressController: GetAddress = new GetAddress(
    controllerComponents,
    getAddressIOService,
    actionBuilders,
  )

  lazy val paperRoundController: PaperRound = new PaperRound(
    controllerComponents,
    paperRoundServiceProvider,
    actionBuilders,
    testUsers,
    appConfig.stage,
  )

  lazy val promotionsController: Promotions = new Promotions(
    promotionServiceProvider,
    priceSummaryServiceProvider,
    assetsResolver,
    actionBuilders,
    testUsers,
    controllerComponents,
    allSettingsProvider,
    appConfig.stage,
  )

  lazy val pricesController: PricesController = new PricesController(
    priceSummaryServiceProvider,
    actionBuilders,
    controllerComponents,
  )

}
