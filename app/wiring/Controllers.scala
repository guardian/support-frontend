package wiring

import controllers._
import play.api.BuiltInComponentsFromContext

trait Controllers {
  self: AssetsComponents with Services with BuiltInComponentsFromContext with ApplicationConfiguration with ActionBuilders with Assets with GoogleAuth =>

  lazy val assetController = new controllers.Assets(httpErrorHandler, assetsMetadata)

  lazy val applicationController = new Application(
    actionRefiners,
    assetsResolver,
    identityService,
    controllerComponents,
    appConfig.oneOffStripeConfigProvider,
    paymentAPIService,
    stringsConfig,
    appConfig.settings
  )

  lazy val subscriptionsController = new Subscriptions(
    actionRefiners,
    assetsResolver,
    controllerComponents,
    stringsConfig,
    appConfig.settings
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
    appConfig.settings,
    appConfig.guardianDomain
  )

  lazy val payPalRegularController = new PayPalRegular(
    actionRefiners,
    assetsResolver,
    payPalNvpServiceProvider,
    testUsers,
    controllerComponents,
    appConfig.settings
  )

  lazy val payPalOneOffController = new PayPalOneOff(
    actionRefiners,
    assetsResolver,
    testUsers,
    controllerComponents,
    paymentAPIService,
    identityService,
    appConfig.settings
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
    appConfig.settings
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
}
