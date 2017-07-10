package wiring

import actions.{ActionRefiners, CachedAction}
import assets.AssetsResolver
import config.Configuration
import play.api.routing.Router
import controllers.{Application, Assets, MonthlyContributions}
import filters.CheckCacheHeadersFilter
import lib.CustomHttpErrorHandler
import services.stepfunctions.{Encryption, MonthlyContributionsClient, StateWrapper}
import services.stepfunctions.StateWrapper
import monitoring.SentryLogging
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.filters.gzip.GzipFilter
import services.{AuthenticationService, IdentityService, MembersDataService, TestUserService}
import play.api.BuiltInComponentsFromContext
import controllers.AssetsComponents
import config.Stages

trait Services {
  self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents with ApplicationConfiguration =>

  implicit private val implicitWs = wsClient

  implicit lazy val membersDataService = MembersDataService(appConfig.membersDataServiceApiUrl)

  implicit lazy val identityService = IdentityService(appConfig.identity)

  implicit lazy val touchpointConfigProvider = appConfig.touchpointConfigProvider

  implicit lazy val stateWrapper = new StateWrapper(Encryption.getProvider(appConfig.aws))

  implicit lazy val monthlyContributionsClient = {
    val monthlyContributionsStage = if (appConfig.stage == Stages.DEV) Stages.CODE else appConfig.stage
    MonthlyContributionsClient(monthlyContributionsStage)
  }

  implicit lazy val testUsers = TestUserService(appConfig.identity.testUserSecret)

  lazy val authenticationService = AuthenticationService(appConfig.identity.keys).authenticatedIdUserProvider
}

trait Controllers {
  self: AssetsComponents with Services with BuiltInComponentsFromContext with ApplicationConfiguration =>

  implicit private lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)
  implicit private lazy val actionRefiners = new ActionRefiners(
    authenticatedIdUserProvider = authenticationService,
    idWebAppUrl = appConfig.identity.webappUrl,
    supportUrl = appConfig.supportUrl,
    testUsers = testUsers,
    cc = controllerComponents
  )

  implicit private val cachedAction = new CachedAction(defaultActionBuilder)(executionContext)
  implicit val cc = controllerComponents

  lazy val assetController = new Assets(httpErrorHandler, assetsMetadata)
  lazy val applicationController = new Application
  lazy val monthlyContributionsController = new MonthlyContributions
}

trait ApplicationConfiguration {
  val appConfig = new Configuration()
}

trait AppComponents extends PlayComponents
    with AhcWSComponents
    with AssetsComponents
    with Controllers
    with Services
    with ApplicationConfiguration {
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
