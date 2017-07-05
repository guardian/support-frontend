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
import play.api.mvc.{ControllerComponents, EssentialFilter}
import play.filters.gzip.GzipFilter
import services.{AuthenticationService, IdentityService, MembersDataService, TestUserService}
import play.api.BuiltInComponentsFromContext
import controllers.AssetsComponents

import scala.concurrent.ExecutionContext

trait Services { self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents =>

  def appConfig: Configuration

  implicit private val implicitWs = wsClient

  implicit lazy val membersDataService = new MembersDataService(appConfig.membersDataServiceApiUrl)
  implicit lazy val identityService: IdentityService = new IdentityService(appConfig.identity.apiUrl, appConfig.identity.apiClientToken)
  lazy val authenticationService = new AuthenticationService(appConfig.identity.keys).authenticatedIdUserProvider
  implicit lazy val monthlyContributionsClient = new MonthlyContributionsClient(appConfig.stage)
  implicit lazy val testUsers = new TestUserService(appConfig.identity.testUserSecret)
}

trait Controllers { self: AssetsComponents with Services with BuiltInComponentsFromContext =>

  implicit val assetsResolver: AssetsResolver
  implicit val actionRefiners: ActionRefiners
  implicit val cc: ControllerComponents
  implicit val cachedAction: CachedAction

  lazy val assetController = new Assets(httpErrorHandler, assetsMetadata)
  lazy val applicationController = new Application
  lazy val monthlyContributionsController = new MonthlyContributions
}

trait AppComponents extends Controllers with PlayComponents with AhcWSComponents with AssetsComponents with Services { self: BuiltInComponentsFromContext =>

  val appConfig = new Configuration()

  implicit lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)(executionContext)

  implicit lazy val actionRefiners = new ActionRefiners(
    authenticatedIdUserProvider = authenticationService,
    idWebAppUrl = appConfig.identity.webappUrl,
    supportUrl = appConfig.supportUrl,
    testUsers = testUsers,
    cc = controllerComponents
  )

  implicit val cachedAction = new CachedAction(defaultActionBuilder)(executionContext)
  implicit val cc = controllerComponents

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

  appConfig.sentryDsn foreach { dsn => new SentryLogging(dsn, appConfig.stage) }
}