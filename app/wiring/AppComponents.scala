package wiring

import actions.{ActionRefiners, CachedAction}
import assets.AssetsResolver
import config.Configuration
import play.api.routing.Router
import controllers.{Application, Assets, MonthlyContributions}
import filters.CheckCacheHeadersFilter
import lib.CustomHttpErrorHandler
import services.stepfunctions.MonthlyContributionsClient
import monitoring.SentryLogging
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.filters.gzip.GzipFilter
import services.{AuthenticationService, IdentityService, MembersDataService, TestUserService}
import play.api.BuiltInComponentsFromContext
import controllers.AssetsComponents

import scala.concurrent.ExecutionContext

trait AppComponents extends PlayComponents with AhcWSComponents with AssetsComponents { self: BuiltInComponentsFromContext =>

  implicit val implicitWsClient = wsClient

  val appConfig = new Configuration()

  implicit lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)

  implicit lazy val membersDataService = new MembersDataService(appConfig.membersDataServiceApiUrl)
  implicit lazy val identityService = new IdentityService(appConfig.identity.apiUrl, appConfig.identity.apiClientToken)

  implicit lazy val actionRefiners = new ActionRefiners(
    authenticatedIdUserProvider = new AuthenticationService(appConfig.identity.keys).authenticatedIdUserProvider,
    idWebAppUrl = appConfig.identity.webappUrl,
    supportUrl = appConfig.supportUrl,
    testUsers = testUsers,
    cc = controllerComponents
  )

  implicit val cachedAction = new CachedAction(defaultActionBuilder)
  implicit val cc = controllerComponents
  implicit lazy val monthlyContributionsClient = new MonthlyContributionsClient(appConfig.stage)
  implicit lazy val testUsers = new TestUserService(appConfig.identity.testUserSecret)

  lazy val assetController = new Assets(httpErrorHandler, assetsMetadata)
  lazy val applicationController = new Application
  lazy val monthlyContributionsController = new MonthlyContributions

  override lazy val httpErrorHandler = new CustomHttpErrorHandler(environment, configuration, sourceMapper, Some(router))

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(
    new CheckCacheHeadersFilter(),
    new GzipFilter(shouldGzip = (req, _) => !req.path.startsWith("/assets/images"))
  )

  override lazy val router: Router = new router.Routes(
    httpErrorHandler,
    applicationController,
    new controllers.Default,
    monthlyContributionsController,
    assetController
  )

  appConfig.sentryDsn foreach { dsn => new SentryLogging(dsn, appConfig.stage) }
}