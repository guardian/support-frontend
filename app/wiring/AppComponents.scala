package wiring

import controllers.AssetsComponents
import filters.{CacheHeadersCheck, SetCookiesCheck}
import lib.CustomHttpErrorHandler
import monitoring.{SentryLogging, StateMachineMonitor}
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import play.filters.HttpFiltersComponents
import play.filters.gzip.GzipFilter

trait AppComponents extends PlayComponents
  with AhcWSComponents
  with AssetsComponents
  with Controllers
  with Services
  with ApplicationConfiguration
  with ActionBuilders
  with Assets
  with GoogleAuth
  with HttpFiltersComponents
  with Monitoring {
  self: BuiltInComponentsFromContext =>

  override lazy val httpErrorHandler = new CustomHttpErrorHandler(
    environment,
    configuration,
    sourceMapper,
    Some(router),
    assetsResolver,
    settingsProvider
  )

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(
    new SetCookiesCheck(),
    securityHeadersFilter,
    new CacheHeadersCheck(),
    new GzipFilter(shouldGzip = (req, _) => !req.path.startsWith("/assets/images"))
  )

  override lazy val router: Router = new _root_.router.Routes(
    httpErrorHandler,
    applicationController,
    siteMapController,
    regularContributionsController,
    supportWorkersStatusController,
    identityController,
    oneOffContributions,
    subscriptionsController,
    digitalPackController,
    loginController,
    testUsersController,
    payPalRegularController,
    payPalOneOffController,
    directDebitController,
    assetController
  )

  SentryLogging.init(appConfig)
  new StateMachineMonitor(supportWorkersClient, actorSystem).start()
}
