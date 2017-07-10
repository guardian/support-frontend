package wiring

import actions.ActionRefiners
import assets.AssetsResolver
import config.TouchpointConfigProvider
import controllers.{Application, Assets, MonthlyContributions}
import play.api.BuiltInComponentsFromContext
import controllers.AssetsComponents
import play.api.mvc.ControllerComponents
import services.{IdentityService, MembersDataService, TestUserService}
import services.stepfunctions.MonthlyContributionsClient

import scala.concurrent.ExecutionContext

trait Controllers {
  self: AssetsComponents with Services with BuiltInComponentsFromContext with ApplicationConfiguration with ActionBuilders =>

  implicit private lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)

  lazy val assetController = new Assets(httpErrorHandler, assetsMetadata)

  lazy val applicationController = new Application(
    actionRefiners,
    assetsResolver,
    identityService,
    controllerComponents,
    cachedAction
  )

  lazy val monthlyContributionsController = new MonthlyContributions(
    monthlyContributionsClient,
    assetsResolver,
    actionRefiners,
    membersDataService,
    identityService,
    testUsers,
    touchpointConfigProvider,
    controllerComponents
  )
}