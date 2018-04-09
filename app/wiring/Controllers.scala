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
    appConfig.paymentApiUrl,
    appConfig.paymentApiPayPalCreatePaymentPath,
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
    paymentAPIService
  )

  lazy val oneOffContributions = new OneOffContributions(
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    appConfig.oneOffStripeConfigProvider,
    appConfig.contributionsStripeEndpoint,
    appConfig.paymentApiUrl,
    appConfig.paymentApiPayPalCreatePaymentPath,
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
