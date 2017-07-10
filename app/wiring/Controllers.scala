package wiring

import assets.AssetsResolver
import controllers.{Application, Assets, MonthlyContributions}
import play.api.BuiltInComponentsFromContext
import controllers.AssetsComponents

trait Controllers {
  self: AssetsComponents with Services with BuiltInComponentsFromContext with ApplicationConfiguration with ActionBuilders =>

  implicit private lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)
  implicit val cc = controllerComponents

  lazy val assetController = new Assets(httpErrorHandler, assetsMetadata)
  lazy val applicationController = new Application
  lazy val monthlyContributionsController = new MonthlyContributions
}