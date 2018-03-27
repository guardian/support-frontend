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
    appConfig.contributionsPayPalAuthEndpoint,
    stringsConfig
  )

  lazy val regularContributionsController = new RegularContributions(
    regularContributionsClient,
    assetsResolver,
    actionRefiners,
    membersDataService,
    identityService,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.payPalConfigProvider,
    controllerComponents
  )

  lazy val payPalNvpController = new PayPalNvp(
    actionRefiners,
    assetsResolver,
    payPalServiceProvider,
    testUsers,
    controllerComponents
  )

  lazy val payPalRestController = new PayPalRest(
    actionRefiners,
    assetsResolver,
    payPalServiceProvider,
    testUsers,
    controllerComponents,
    contributionsFrontendService
  )

  lazy val oneOffContributions = new OneOffContributions(
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    appConfig.oneOffStripeConfigProvider,
    appConfig.contributionsStripeEndpoint,
    appConfig.contributionsPayPalAuthEndpoint,
    authAction,
    controllerComponents
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
