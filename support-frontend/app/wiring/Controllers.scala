package wiring

import assets.RefPath
import com.gu.aws.AwsCloudWatchMetricPut
import com.gu.aws.AwsCloudWatchMetricSetup.setupWarningRequest
import controllers.{CSSElementForStage, _}
import lib.ErrorController
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents

trait Controllers {

  // scalastyle:off
  self: AssetsComponents with Services with BuiltInComponentsFromContext with ApplicationConfiguration with ActionBuilders with wiring.Assets with GoogleAuth with Monitoring with AhcWSComponents =>
  // scalastyle:on

  lazy val assetController = new controllers.Assets(httpErrorHandler, assetsMetadata)
  lazy val faviconController = new controllers.Favicon(actionRefiners, appConfig.stage)(fileMimeTypes, implicitly)
  def errorController: ErrorController
  lazy val elementForStage = CSSElementForStage(assetsResolver.getFileContentsAsHtml, appConfig.stage)_
  lazy val fontLoader = elementForStage(RefPath("fontLoader.js"))

  lazy val applicationController = new Application(
    actionRefiners,
    assetsResolver,
    identityService,
    controllerComponents,
    appConfig.oneOffStripeConfigProvider,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    appConfig.amazonPayConfigProvider,
    appConfig.recaptchaConfigProvider,
    paymentAPIService,
    membersDataService,
    stringsConfig,
    allSettingsProvider,
    appConfig.guardianDomain,
    appConfig.stage,
    appConfig.supportUrl,
    fontLoader
  )

  lazy val diagnosticsController = new DiagnosticsController(
    actionRefiners
  )

  lazy val articleShareController = new ArticleShare(
    actionRefiners,
    controllerComponents,
    capiService
  )

  lazy val subscriptionsController = new Subscriptions(
    actionRefiners,
    identityService,
    priceSummaryServiceProvider,
    assetsResolver,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
    fontLoader
  )

  lazy val redemptionController = new RedemptionController(
    actionRefiners,
    assetsResolver,
    allSettingsProvider,
    identityService,
    membersDataService,
    testUsers,
    controllerComponents,
    fontLoader,
    dynamoTableAsyncProvider,
    zuoraGiftLookupServiceProvider
  )

  private lazy val landingCopyProvider = new LandingCopyProvider(
    promotionServiceProvider,
    appConfig.stage
  )

  lazy val digitalPackController = new DigitalSubscriptionController(
    priceSummaryServiceProvider,
    landingCopyProvider,
    assetsResolver,
    actionRefiners,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
    fontLoader
  )

  lazy val paperController = new PaperSubscription(
    priceSummaryServiceProvider,
    landingCopyProvider,
    assetsResolver,
    actionRefiners,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
    fontLoader
  )

  lazy val weeklyController = new WeeklySubscription(
    priceSummaryServiceProvider,
    landingCopyProvider,
    assetsResolver,
    actionRefiners,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl,
    fontLoader,
    wsClient
  )

  lazy val digitalPackFormController = new DigitalSubscriptionFormController(
    priceSummaryServiceProvider,
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    membersDataService,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    fontLoader,
    appConfig.recaptchaConfigProvider
  )

  lazy val paperFormController = new PaperSubscriptionForm(
    priceSummaryServiceProvider,
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    fontLoader,
    appConfig.recaptchaConfigProvider
  )

  lazy val weeklyFormController = new WeeklySubscriptionForm(
    priceSummaryServiceProvider,
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    allSettingsProvider,
    fontLoader,
    appConfig.recaptchaConfigProvider
  )

  lazy val createSubscriptionController = new CreateSubscription(
    supportWorkersClient,
    actionRefiners,
    identityService,
    testUsers,
    controllerComponents,
    appConfig.supportUrl,
    appConfig.guardianDomain,
    appConfig.stage
  )

  lazy val supportWorkersStatusController = new SupportWorkersStatus(
    supportWorkersClient,
    controllerComponents,
    actionRefiners
  )

  lazy val stripeController = new StripeController(
    components = controllerComponents,
    actionRefiners = actionRefiners,
    recaptchaService = recaptchaService,
    stripeService = stripeService,
    identityService = identityService,
    recaptchaConfigProvider = appConfig.recaptchaConfigProvider,
    testStripeConfig = appConfig.regularStripeConfigProvider.get(true),
    allSettingsProvider,
    appConfig.stage
  )

  lazy val regularContributionsController = new RegularContributions(
    supportWorkersClient,
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    controllerComponents,
    appConfig.guardianDomain,
    tipMonitoring
  )

  lazy val payPalRegularController = new PayPalRegular(
    actionRefiners,
    assetsResolver,
    payPalNvpServiceProvider,
    testUsers,
    controllerComponents,
    allSettingsProvider,
    fontLoader
  )

  lazy val payPalOneOffController = new PayPalOneOff(
    actionRefiners,
    assetsResolver,
    testUsers,
    controllerComponents,
    paymentAPIService,
    identityService,
    allSettingsProvider,
    tipMonitoring,
    fontLoader
  )

  lazy val testUsersController = new TestUsersManagement(
    authAction,
    controllerComponents,
    testUsers,
    appConfig.supportUrl,
    appConfig.guardianDomain
  )

  lazy val siteMapController = new SiteMap(
    actionRefiners,
    controllerComponents
  )

  lazy val identityController = new IdentityController(
    identityService,
    controllerComponents,
    actionRefiners,
    appConfig.guardianDomain,
    appConfig.identity.webappUrl,
    () => AwsCloudWatchMetricPut(AwsCloudWatchMetricPut.client)(setupWarningRequest(appConfig.stage))
  )

  lazy val directDebitController = new DirectDebit(
    actionRefiners,
    controllerComponents,
    goCardlessServiceProvider,
    testUsers
  )

  lazy val getAddressController = new GetAddress(
    controllerComponents,
    getAddressIOService,
    actionRefiners
  )

  lazy val promotionsController = new Promotions(
    promotionServiceProvider,
    priceSummaryServiceProvider,
    assetsResolver,
    actionRefiners,
    testUsers,
    controllerComponents,
    fontLoader,
    allSettingsProvider,
    appConfig.stage
  )

}
