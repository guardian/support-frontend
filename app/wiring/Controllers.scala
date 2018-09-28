package wiring

import controllers._
import play.api.BuiltInComponentsFromContext

trait Controllers {
  self: AssetsComponents with Services with BuiltInComponentsFromContext with ApplicationConfiguration with ActionBuilders with Assets with GoogleAuth with Monitoring =>

  lazy val assetController = new controllers.Assets(httpErrorHandler, assetsMetadata)

  lazy val applicationController = new Application(
    actionRefiners,
    assetsResolver,
    identityService,
    controllerComponents,
    appConfig.oneOffStripeConfigProvider,
    appConfig.regularStripeConfigProvider,
    paymentAPIService,
    stringsConfig,
    settingsProvider
  )

  lazy val subscriptionsController = new Subscriptions(
    actionRefiners,
    assetsResolver,
    controllerComponents,
    stringsConfig,
    settingsProvider
  )

  lazy val regularContributionsController = new RegularContributions(
    regularContributionsClient,
    assetsResolver,
    actionRefiners,
    membersDataService,
    identityService,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    appConfig.guardianDomain,
    settingsProvider
  )

  lazy val payPalRegularController = new PayPalRegular(
    actionRefiners,
    assetsResolver,
    payPalNvpServiceProvider,
    testUsers,
    controllerComponents,
    settingsProvider,
    tipMonitoring
  )

  lazy val payPalOneOffController = new PayPalOneOff(
    actionRefiners,
    assetsResolver,
    testUsers,
    controllerComponents,
    paymentAPIService,
    identityService,
    settingsProvider,
    tipMonitoring
  )

  lazy val oneOffContributions = new OneOffContributions(
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    appConfig.oneOffStripeConfigProvider,
    paymentAPIService,
    authAction,
    controllerComponents,
    settingsProvider
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
    actionRefiners
  )

  lazy val directDebitController = new DirectDebit(
    actionRefiners,
    controllerComponents,
    goCardlessServiceProvider,
    testUsers
  )

  lazy val prodMonitoring = new ProdMonitoring(
    actionRefiners,
    controllerComponents,
    tipMonitoring
  )
}
