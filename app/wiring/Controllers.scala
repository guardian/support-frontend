package wiring

import controllers.{Application, Assets, MonthlyContributions}
import play.api.BuiltInComponentsFromContext
import controllers.AssetsComponents

trait Controllers {
  self: AssetsComponents with Services with BuiltInComponentsFromContext with ApplicationConfiguration with ActionBuilders =>

  lazy val assetController = new Assets(httpErrorHandler, assetsMetadata)

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
}