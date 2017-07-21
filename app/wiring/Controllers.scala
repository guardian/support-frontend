package wiring

import actions.CustomActionBuilders
import assets.AssetsResolver
import config.TouchpointConfigProvider
import controllers._
import play.api.BuiltInComponentsFromContext
import play.api.mvc.ControllerComponents
import services.{IdentityService, TestUserService}

trait Controllers {
  self: AssetsComponents with Services with BuiltInComponentsFromContext with ApplicationConfiguration with ActionBuilders with Assets with GoogleAuth =>

  lazy val assetController = new controllers.Assets(httpErrorHandler, assetsMetadata)

  lazy val applicationController = new Application(
    actionRefiners,
    assetsResolver,
    identityService,
    controllerComponents
  )

  lazy val monthlyContributionsController = new MonthlyContributions(
    monthlyContributionsClient,
    assetsResolver,
    actionRefiners,
    membersDataService,
    identityService,
    testUsers,
    appConfig.touchpointConfigProvider,
    controllerComponents
  )

  lazy val oneOffContributions = new OneOffContributions(
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    appConfig.touchpointConfigProvider,
    authAction,
    controllerComponents
  )

  lazy val testUsersContoller = new TestUsersManagement(
    authAction,
    controllerComponents,
    testUsers
  )
}