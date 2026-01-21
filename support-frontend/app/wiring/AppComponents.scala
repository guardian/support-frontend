package wiring

import controllers.AssetsComponents
import filters.{CacheHeadersCheck, RelaxReferrerPolicyFromRedirectFilter, SetCookiesCheck}
import lib.{CustomHttpErrorHandler, ErrorController}
import monitoring.{SentryLogging, StateMachineMonitor}
import play.api.ApplicationLoader.Context
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import play.filters.HttpFiltersComponents
import play.filters.cors.CORSComponents
import play.filters.csp.CSPComponents
import play.filters.gzip.GzipFilter

class AppComponents(context: Context)
    extends BuiltInComponentsFromContext(context)
    with PlayComponents
    with AhcWSComponents
    with AssetsComponents
    with Controllers
    with Services
    with ApplicationConfiguration
    with ActionBuilders
    with Assets
    with GoogleAuth
    with CORSComponents
    with CSPComponents
    with HttpFiltersComponents {

  private lazy val customHandler: CustomHttpErrorHandler = new CustomHttpErrorHandler(
    environment,
    configuration,
    devContext.map(_.sourceMapper),
    Some(router),
    assetsResolver,
    allSettingsProvider,
  )
  override lazy val httpErrorHandler = customHandler
  override lazy val errorController = new ErrorController(actionBuilders, customHandler)

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(
    // This filter needs to be before the `securityHeadersFilter` as it removes a header set by that filter
    new RelaxReferrerPolicyFromRedirectFilter(),
    cspFilter,
    corsFilter,
    new SetCookiesCheck(),
    securityHeadersFilter,
    new CacheHeadersCheck(),
    new GzipFilter(shouldGzip = (req, _) => !req.path.startsWith("/assets/images")),
  )

  override lazy val router: Router = new _root_.router.Routes(
    httpErrorHandler,
    applicationController,
    errorController,
    diagnosticsController,
    siteMapController,
    articleShareController,
    createSubscriptionController,
    supportWorkersStatusController,
    stripeController,
    identityController,
    subscriptionsController,
    weeklyController,
    paperController,
    getAddressController,
    paperRoundController,
    loginController,
    testUsersController,
    authCodeFlowController,
    payPalRegularController,
    payPalOneOffController,
    directDebitController,
    promotionsController,
    pricesController,
    analyticsController,
    newspaperArchiveController,
    assetController,
    faviconController,
  )

  SentryLogging.init(appConfig)
  new StateMachineMonitor(supportWorkersClient, actorSystem).start()
}
