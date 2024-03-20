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

  lazy val assetController = new controllers.Assets(httpErrorHandler, assetsMetadata)
  lazy val faviconController = new controllers.Favicon(actionBuilders, appConfig.stage)(fileMimeTypes, implicitly)
  def errorController: ErrorController
  lazy val elementForStage = CSSElementForStage(assetsResolver.getFileContentsAsHtml, appConfig.stage) _

  lazy val applicationController = new Application(
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
    implicitWs,
    priceSummaryServiceProvider,
    appConfig.supportUrl,
  )

  lazy val diagnosticsController = new DiagnosticsController(
    actionBuilders,
  )

  lazy val articleShareController = new ArticleShare(
    actionBuilders,
    controllerComponents,
    capiService,
  )

  lazy val subscriptionsController = new SubscriptionsController(
    actionBuilders,
    priceSummaryServiceProvider,
    assetsResolver,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
  )

  lazy val redemptionController = new RedemptionController(
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

  lazy val digitalPackController = new DigitalSubscriptionController(
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
    appConfig.supportUrl,
  )

  lazy val paperController = new PaperSubscriptionController(
    priceSummaryServiceProvider,
    landingCopyProvider,
    assetsResolver,
    actionBuilders,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
  )

  lazy val weeklyController = new WeeklySubscriptionController(
    priceSummaryServiceProvider,
    landingCopyProvider,
    assetsResolver,
    actionBuilders,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
  )

  lazy val digitalPackFormController = new DigitalSubscriptionFormController(
    priceSummaryServiceProvider,
    assetsResolver,
    actionBuilders,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    appConfig.recaptchaConfigProvider,
  )

  lazy val paperFormController = new PaperSubscriptionFormController(
    priceSummaryServiceProvider,
    assetsResolver,
    actionBuilders,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    appConfig.recaptchaConfigProvider,
  )

  lazy val weeklyFormController = new WeeklySubscriptionFormController(
    priceSummaryServiceProvider,
    assetsResolver,
    actionBuilders,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    appConfig.recaptchaConfigProvider,
  )

  lazy val createSubscriptionController = new CreateSubscriptionController(
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

  lazy val supportWorkersStatusController = new SupportWorkersStatus(
    supportWorkersClient,
    controllerComponents,
    actionBuilders,
  )

  lazy val stripeController = new StripeController(
    components = controllerComponents,
    actionRefiners = actionBuilders,
    recaptchaService = recaptchaService,
    stripeService = stripeService,
    recaptchaConfigProvider = appConfig.recaptchaConfigProvider,
    allSettingsProvider,
    appConfig.stage,
  )

  lazy val payPalRegularController = new PayPalRegular(
    actionBuilders,
    assetsResolver,
    payPalNvpServiceProvider,
    testUsers,
    controllerComponents,
    allSettingsProvider,
  )

  lazy val payPalOneOffController = new PayPalOneOff(
    actionBuilders,
    assetsResolver,
    testUsers,
    controllerComponents,
    paymentAPIService,
    allSettingsProvider,
  )

  lazy val testUsersController = new TestUsersManagement(
    authAction,
    controllerComponents,
    testUsers,
    appConfig.supportUrl,
    appConfig.guardianDomain,
  )

  lazy val authCodeFlowController =
    new AuthCodeFlowController(controllerComponents, asyncAuthenticationService, appConfig.identity)

  lazy val siteMapController = new SiteMap(
    actionBuilders,
    controllerComponents,
  )

  lazy val identityController = new IdentityController(
    identityService,
    controllerComponents,
    actionBuilders,
    appConfig.identity.webappUrl,
    () => AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(setupWarningRequest(appConfig.stage)),
  )

  lazy val directDebitController = new DirectDebit(
    actionBuilders,
    controllerComponents,
    goCardlessServiceProvider,
    testUsers,
  )

  lazy val getAddressController = new GetAddress(
    controllerComponents,
    getAddressIOService,
    actionBuilders,
  )

  lazy val paperRoundController = new PaperRound(
    controllerComponents,
    paperRoundServiceProvider,
    actionBuilders,
    testUsers,
    appConfig.stage,
  )

  lazy val promotionsController = new Promotions(
    promotionServiceProvider,
    priceSummaryServiceProvider,
    assetsResolver,
    actionBuilders,
    testUsers,
    controllerComponents,
    allSettingsProvider,
    appConfig.stage,
  )

  lazy val pricesController = new PricesController(
    priceSummaryServiceProvider,
    actionBuilders,
    controllerComponents,
  )

}
