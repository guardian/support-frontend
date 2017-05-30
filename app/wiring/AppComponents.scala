package wiring

import assets.AssetsResolver
import config.Configuration
import play.api.routing.Router
import router.Routes
import controllers.{Application, Assets}
import filters.CheckCacheHeadersFilter
import lib.CustomHttpErrorHandler
import monitoring.SentryLogging
import play.api.mvc.EssentialFilter
import play.filters.gzip.GzipFilter

trait AppComponents extends PlayComponents {

  val config = new Configuration()

  override lazy val httpErrorHandler = new CustomHttpErrorHandler(environment, configuration, sourceMapper, Some(router))
  implicit lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)
  lazy val assetController = new Assets(httpErrorHandler)
  lazy val applicationController = new Application()

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(
    new CheckCacheHeadersFilter(),
    new GzipFilter(shouldGzip = (req, _) => !req.path.startsWith("/assets/images"))
  )
  override lazy val router: Router = new Routes(httpErrorHandler, assetController, applicationController, controllers.Default, prefix = "/")

  config.sentryDsn foreach { dsn => new SentryLogging(dsn, config.stage) }
}