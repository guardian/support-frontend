package wiring

import assets.AssetsResolver
import play.api.routing.Router
import router.Routes
import controllers.{Application, Assets}
import filters.CheckCacheHeadersFilter
import lib.CustomHttpErrorHandler
import play.api.mvc.EssentialFilter

trait AppComponents extends PlayComponents {

  override lazy val httpErrorHandler = new CustomHttpErrorHandler(environment, configuration, sourceMapper, Some(router))
  implicit lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)
  lazy val assetController = new Assets(httpErrorHandler)
  lazy val applicationController = new Application()

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(new CheckCacheHeadersFilter())
  override lazy val router: Router = new Routes(httpErrorHandler, assetController, applicationController, controllers.Default, prefix = "/")
}