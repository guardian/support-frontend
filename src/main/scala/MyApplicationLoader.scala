
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import play.api._
import play.api.ApplicationLoader.Context
import play.api.db.{DBComponents, HikariCPComponents}
import play.api.libs.ws.WSClient
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes
import util.RequestBasedProvider

import aws.AWSClientBuilder
import backend.{PaypalBackend, StripeBackend}
import _root_.controllers.{AppController, PaypalController, StripeController}
import model.{AppThreadPools, AppThreadPoolsProvider, RequestEnvironments}
import conf.{AppConfig, ConfigLoader, DBConfig, PlayConfigUpdater}
import services.DatabaseProvider

class MyApplicationLoader extends ApplicationLoader {
  def load(context: Context): Application = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment, context.initialConfiguration, Map.empty)
    }
    new MyComponents(context).application
  }
}

class MyComponents(context: Context) extends BuiltInComponentsFromContext(context)
  with DBComponents
  with NoHttpFiltersComponents
  with HikariCPComponents
  with AhcWSComponents
  with AppThreadPoolsProvider {

  override val threadPools: AppThreadPools = AppThreadPools.load(executionContext, actorSystem).valueOr(throw _)

  implicit val _wsClient: WSClient = wsClient

  // TODO: is prod value should be set in public Play configuration
  // At this point, the app either gets two request environments that differ
  // (Live and Test), or two that are the same (Test and Test).
  // This will determine, later on, whether passing the "?mode=test" param has any effect
  val requestEnvironments: RequestEnvironments = RequestEnvironments.forAppMode(isProd = false)

  val ssm: AWSSimpleSystemsManagement = AWSClientBuilder.buildAWSSimpleSystemsManagementClient()
  val configLoader: ConfigLoader = new ConfigLoader(ssm)

  val playConfigUpdater = new PlayConfigUpdater(configLoader, super.configuration)

  // I guess it could be nice if a given config knew whether it was
  // request-environment-dependent or app-mode-dependent
  override val configuration: Configuration = playConfigUpdater
    .merge[DBConfig](requestEnvironments)
    .merge[AppConfig](environment.mode)
    .configuration

  val databaseProvider = new DatabaseProvider(dbApi)

  val stripeBackendProvider: RequestBasedProvider[StripeBackend] =
    new StripeBackend.Builder(configLoader, databaseProvider)
      .buildRequestBasedProvider(requestEnvironments)
      .valueOr(throw _)

  val paypalBackendProvider: RequestBasedProvider[PaypalBackend] =
    new PaypalBackend.Builder(configLoader, databaseProvider)
      .buildRequestBasedProvider(requestEnvironments)
      .valueOr(throw _)

  override val router =
    new Routes(
      httpErrorHandler,
      new AppController(controllerComponents),
      new StripeController(controllerComponents, stripeBackendProvider),
      new PaypalController(controllerComponents, paypalBackendProvider)
    )
}
