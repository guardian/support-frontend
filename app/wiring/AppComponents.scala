package wiring

import assets.AssetsResolver
import config.Configuration
import play.api.routing.Router
import router.Routes
import controllers.{Application, Assets, MonthlyContributions}
import filters.CheckCacheHeadersFilter
import lib.CustomHttpErrorHandler
import lib.stepfunctions.MonthlyContributionsClient
import monitoring.SentryLogging
import play.api.mvc.EssentialFilter

trait AppComponents extends PlayComponents {

  val config = new Configuration()

  override lazy val httpErrorHandler = new CustomHttpErrorHandler(environment, configuration, sourceMapper, Some(router))
  implicit lazy val assetsResolver = new AssetsResolver("/assets/", "assets.map", environment)
  lazy val assetController = new Assets(httpErrorHandler)
  lazy val applicationController = new Application()
  lazy val monthlyContributionsClient = new MonthlyContributionsClient(config.stage)
  lazy val monthlyContributionsController = new MonthlyContributions(monthlyContributionsClient)

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(new CheckCacheHeadersFilter())
  override lazy val router: Router = new Routes(
    httpErrorHandler,
    assetController,
    applicationController,
    controllers.Default,
    monthlyContributionsController,
    prefix = "/"
  )

  config.sentryDsn foreach { dsn => new SentryLogging(dsn, config.stage) }
}