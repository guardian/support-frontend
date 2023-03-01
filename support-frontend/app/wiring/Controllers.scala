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
  lazy val faviconController = new controllers.Favicon(actionRefiners, appConfig.stage)(fileMimeTypes, implicitly)
  def errorController: ErrorController
  lazy val elementForStage = CSSElementForStage(assetsResolver.getFileContentsAsHtml, appConfig.stage) _

  lazy val applicationController = new Application(
    actionRefiners,
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
    appConfig.supportUrl,
  )

  lazy val diagnosticsController = new DiagnosticsController(
    actionRefiners,
  )

  lazy val articleShareController = new ArticleShare(
    actionRefiners,
    controllerComponents,
    capiService,
  )

  lazy val subscriptionsController = new SubscriptionsController(
    actionRefiners,
    priceSummaryServiceProvider,
    assetsResolver,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
  )

  lazy val redemptionController = new RedemptionController(
    actionRefiners,
    assetsResolver,
    allSettingsProvider,
    testUsers,
    controllerComponents,
    dynamoTableAsyncProvider,
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
    actionRefiners,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
    appConfig.recaptchaConfigProvider,
  )

  lazy val paperController = new PaperSubscriptionController(
    priceSummaryServiceProvider,
    landingCopyProvider,
    assetsResolver,
    actionRefiners,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
  )

  lazy val weeklyController = new WeeklySubscriptionController(
    priceSummaryServiceProvider,
    landingCopyProvider,
    assetsResolver,
    actionRefiners,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
  )

  lazy val digitalPackFormController = new DigitalSubscriptionFormController(
    priceSummaryServiceProvider,
    assetsResolver,
    actionRefiners,
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
    actionRefiners,
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
    actionRefiners,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    appConfig.recaptchaConfigProvider,
  )

  lazy val createSubscriptionController = new CreateSubscriptionController(
    supportWorkersClient,
    actionRefiners,
    identityService,
    recaptchaService = recaptchaService,
    recaptchaConfigProvider = appConfig.recaptchaConfigProvider,
    allSettingsProvider,
    testUsers,
    controllerComponents,
    appConfig.guardianDomain,
  )

  lazy val supportWorkersStatusController = new SupportWorkersStatus(
    supportWorkersClient,
    controllerComponents,
    actionRefiners,
  )

  lazy val stripeController = new StripeController(
    components = controllerComponents,
    actionRefiners = actionRefiners,
    recaptchaService = recaptchaService,
    stripeService = stripeService,
    recaptchaConfigProvider = appConfig.recaptchaConfigProvider,
    testStripeConfig = appConfig.regularStripeConfigProvider.get(true),
    allSettingsProvider,
    appConfig.stage,
  )

  lazy val payPalRegularController = new PayPalRegular(
    actionRefiners,
    assetsResolver,
    payPalNvpServiceProvider,
    testUsers,
    controllerComponents,
    allSettingsProvider,
  )

  lazy val payPalOneOffController = new PayPalOneOff(
    actionRefiners,
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

  lazy val siteMapController = new SiteMap(
    actionRefiners,
    controllerComponents,
  )

  lazy val identityController = new IdentityController(
    identityService,
    controllerComponents,
    actionRefiners,
    appConfig.identity.webappUrl,
    () => AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(setupWarningRequest(appConfig.stage)),
  )

  lazy val directDebitController = new DirectDebit(
    actionRefiners,
    controllerComponents,
    goCardlessServiceProvider,
    testUsers,
  )

  lazy val getAddressController = new GetAddress(
    controllerComponents,
    getAddressIOService,
    actionRefiners,
  )

  lazy val promotionsController = new Promotions(
    promotionServiceProvider,
    priceSummaryServiceProvider,
    assetsResolver,
    actionRefiners,
    testUsers,
    controllerComponents,
    allSettingsProvider,
    appConfig.stage,
  )

  lazy val pricesController = new PricesController(
    priceSummaryServiceProvider,
    actionRefiners,
    controllerComponents,
  )

}
