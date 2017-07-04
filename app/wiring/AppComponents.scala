package wiring

import assets.AssetsResolver
import config.Configuration
import play.api.routing.Router
import router.Routes
import controllers.{Application, Assets, MonthlyContributions}
import filters.CheckCacheHeadersFilter
import lib.CustomHttpErrorHandler
import lib.actions.ActionRefiners
import lib.stepfunctions.{Encryption, MonthlyContributionsClient, StateWrapper}
import monitoring.SentryLogging
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.filters.gzip.GzipFilter
import services.{AuthenticationService, IdentityService, MembersDataService}
import lib.TestUsers
import config.Stages

trait AppComponents extends PlayComponents with AhcWSComponents {

  implicit val implicitWsClient = wsClient

  val config = new Configuration()

  implicit lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)

  implicit lazy val membersDataService = new MembersDataService(config.membersDataServiceApiUrl)
  implicit lazy val identityService = new IdentityService(config.identity.apiUrl, config.identity.apiClientToken)

  implicit lazy val actionRefiners = new ActionRefiners(
    authenticatedIdUserProvider = new AuthenticationService(config.identity.keys).authenticatedIdUserProvider,
    idWebAppUrl = config.identity.webappUrl,
    supportUrl = config.supportUrl,
    testUsers = testUsers
  )
  
  implicit lazy val stateWrapper = new StateWrapper(Encryption.getProvider(config.aws))
  implicit lazy val monthlyContributionsClient = new MonthlyContributionsClient(if (config.stage == Stages.DEV) Stages.CODE else config.stage)
  implicit lazy val testUsers = new TestUsers(config.identity.testUserSecret)
  implicit lazy val touchpointConfigProvider = config.touchpointConfigProvider

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
