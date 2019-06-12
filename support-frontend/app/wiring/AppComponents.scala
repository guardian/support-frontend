package wiring

import controllers.AssetsComponents
import filters.{CacheHeadersCheck, SetCookiesCheck}
import lib.{CustomHttpErrorHandler, ErrorController}
import monitoring.{SentryLogging, StateMachineMonitor}
import play.api.ApplicationLoader.Context
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import play.filters.HttpFiltersComponents
import play.filters.gzip.GzipFilter

class AppComponents(context: Context) extends BuiltInComponentsFromContext(context)
  with ApplicationConfiguration
  with PlayComponents
  with AhcWSComponents
  with AssetsComponents
  with Controllers
  with Services
  with ActionBuilders
  with Assets
  with GoogleAuth
  with HttpFiltersComponents
  with Monitoring {
  self: BuiltInComponentsFromContext =>

//  val (appConfig, stringsConfig) = {
//    val conf = new ApplicationConfiguration(configuration.underlying)
//    (conf.appConfig, conf.stringsConfig)
//  }

  private lazy val customHandler: CustomHttpErrorHandler = new CustomHttpErrorHandler(
    environment,
    configuration,
    sourceMapper,
    Some(router),
    assetsResolver,
    allSettingsProvider,
    appConfig.stage
  )
  override lazy val httpErrorHandler = customHandler
  override lazy val errorController = new ErrorController(actionRefiners, customHandler)

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(
    new SetCookiesCheck(),
    securityHeadersFilter,
    new CacheHeadersCheck(),
    new GzipFilter(shouldGzip = (req, _) => !req.path.startsWith("/assets/images"))
  )

  override lazy val router: Router = new _root_.router.Routes(
    httpErrorHandler,
    applicationController,
    errorController,
    siteMapController,
    regularContributionsController,
    supportWorkersStatusController,
    identityController,
    subscriptionsController,
    digitalPackController,
    weeklyController,
    paperController,
    getAddressController,
    createSubscriptionController,
    loginController,
    testUsersController,
    payPalRegularController,
    payPalOneOffController,
    directDebitController,
    assetController,
    faviconController
  )

  SentryLogging.init(appConfig)
  new StateMachineMonitor(supportWorkersClient, actorSystem).start()
}
