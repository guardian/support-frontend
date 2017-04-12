package wiring

import play.api.routing.Router
import router.Routes
import controllers.{Application, Assets}
import filters.CheckCacheHeadersFilter
import play.api.mvc.EssentialFilter

trait AppComponents extends PlayComponents {

  lazy val assetController = new Assets(httpErrorHandler)
  lazy val applicationController = new Application()

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(new CheckCacheHeadersFilter())
  override lazy val router: Router = new Routes(httpErrorHandler, assetController, applicationController, prefix = "/")
}