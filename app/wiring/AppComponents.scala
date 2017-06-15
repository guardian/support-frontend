package wiring

import assets.AssetsResolver
import config.Configuration
import play.api.routing.Router
import router.Routes
import controllers.{Application, Assets, MonthlyContributions}
import filters.CheckCacheHeadersFilter
import lib.CustomHttpErrorHandler
import lib.actions.ActionRefiners
import lib.stepfunctions.MonthlyContributionsClient
import monitoring.SentryLogging
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.filters.gzip.GzipFilter
import services.{AuthenticationService, IdentityService}
import lib.TestUsers

trait AppComponents extends PlayComponents with AhcWSComponents {

  implicit val implicitWsClient = wsClient

  val config = new Configuration()

  implicit lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)

  implicit lazy val identityService = new IdentityService(config.identity.apiUrl, config.identity.apiClientToken)

  implicit lazy val actionRefiners = new ActionRefiners(
    authenticatedIdUserProvider = new AuthenticationService(config.identity.keys).authenticatedIdUserProvider,
    idWebAppUrl = config.identity.webappUrl,
    supportUrl = config.supportUrl,
    testUsers = testUsers
  )

  implicit lazy val monthlyContributionsClient = new MonthlyContributionsClient(config.stage)
  implicit lazy val testUsers = new TestUsers(config.identity.testUserSecret)

  lazy val assetController = new Assets(httpErrorHandler)
  lazy val applicationController = new Application
  lazy val monthlyContributionsController = new MonthlyContributions

  override lazy val httpErrorHandler = new CustomHttpErrorHandler(environment, configuration, sourceMapper, Some(router))

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(
    new CheckCacheHeadersFilter(),
    new GzipFilter(shouldGzip = (req, _) => !req.path.startsWith("/assets/images"))
  )

  override lazy val router: Router = new Routes(
    httpErrorHandler,
    applicationController,
    controllers.Default,
    monthlyContributionsController,
    assetController,
    prefix = "/"
  )

  config.sentryDsn foreach { dsn => new SentryLogging(dsn, config.stage) }
}