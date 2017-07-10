package wiring

import play.api.routing.Router
import filters.CheckCacheHeadersFilter
import lib.CustomHttpErrorHandler
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.filters.gzip.GzipFilter
import play.api.BuiltInComponentsFromContext
import controllers.AssetsComponents

trait AppComponents extends PlayComponents
    with AhcWSComponents
    with AssetsComponents
    with Controllers
    with Services
    with ApplicationConfiguration
    with ActionBuilders {
  self: BuiltInComponentsFromContext =>

  override lazy val httpErrorHandler = new CustomHttpErrorHandler(environment, configuration, sourceMapper, Some(router))

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(
    new CheckCacheHeadersFilter(),
    new GzipFilter(shouldGzip = (req, _) => !req.path.startsWith("/assets/images"))
  )

  override lazy val router: Router = new _root_.router.Routes(
    httpErrorHandler,
    applicationController,
    new controllers.Default,
    monthlyContributionsController,
    assetController
  )

}
