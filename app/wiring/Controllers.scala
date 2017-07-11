package wiring

import controllers.{Application, MonthlyContributions}
import play.api.BuiltInComponentsFromContext
import controllers.AssetsComponents

trait Controllers {
  self: AssetsComponents with Services with BuiltInComponentsFromContext with ApplicationConfiguration with ActionBuilders with Assets =>

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
}