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
    appConfig.contributionsPayPalEndpoint
  )

  lazy val monthlyContributionsController = new MonthlyContributions(
    monthlyContributionsClient,
    assetsResolver,
    actionRefiners,
    membersDataService,
    identityService,
    testUsers,
    appConfig.stripeConfigProvider,
    appConfig.payPalConfigProvider,
    controllerComponents
  )

  lazy val payPalController = new PayPal(
    actionRefiners,
    assetsResolver,
    payPalServiceProvider,
    testUsers,
    controllerComponents
  )

  lazy val oneOffContributions = new OneOffContributions(
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    appConfig.oneOffStripeConfigProvider,
    appConfig.contributionsStripeEndpoint,
    appConfig.contributionsPayPalEndpoint,
    authAction,
    controllerComponents
  )

  lazy val testUsersContoller = new TestUsersManagement(
    authAction,
    controllerComponents,
    testUsers,
    appConfig.supportUrl,
    appConfig.guardianDomain
  )
}