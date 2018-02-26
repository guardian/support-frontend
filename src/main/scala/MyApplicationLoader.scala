
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import play.api._
import play.api.ApplicationLoader.Context
import play.api.db.{DBComponents, HikariCPComponents}
import router.Routes
import util.RequestBasedProvider
import aws.AWSClientBuilder
import backend.{PaypalBackend, StripeBackend}
import _root_.controllers.StripeController
import _root_.controllers.PaypalController
import conf.ConfigLoader
import model.{DefaultThreadPoolProvider, RequestEnvironments}
import services.DatabaseProvider

class MyApplicationLoader extends ApplicationLoader {
  def load(context: Context): Application = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment, context.initialConfiguration, Map.empty)
    }
    new MyComponents(context).application
  }
}

class MyComponents(context: Context)
  extends BuiltInComponentsFromContext(context)
    with DBComponents
    with NoHttpFiltersComponents
    with HikariCPComponents
    with DefaultThreadPoolProvider {

  // TODO: is prod value should be set in public Play configuration
  val requestEnvironments: RequestEnvironments = RequestEnvironments.forAppMode(isProd = false)

  val ssm: AWSSimpleSystemsManagement = AWSClientBuilder.buildAWSSimpleSystemsManagementClient()
  val configLoader: ConfigLoader = new ConfigLoader(ssm)

  override val configuration: Configuration =
    DatabaseProvider.ConfigurationUpdater.updateConfiguration(configLoader, super.configuration, requestEnvironments)

  val databaseProvider = new DatabaseProvider(dbApi)

  val stripeBackendProvider: RequestBasedProvider[StripeBackend] =
    // Actor system not an implicit val, so pass it explicitly
    new StripeBackend.Builder(configLoader, databaseProvider)(actorSystem)
      .buildRequestBasedProvider(requestEnvironments)
      .valueOr(throw _)

  val paypalBackendProvider: RequestBasedProvider[PaypalBackend] =
  // Actor system not an implicit val, so pass it explicitly
    new PaypalBackend.Builder(configLoader, databaseProvider)(actorSystem)
      .buildRequestBasedProvider(requestEnvironments)
      .valueOr(throw _)

  override val router =
    new Routes(
      httpErrorHandler,
      new StripeController(controllerComponents, stripeBackendProvider),
      new PaypalController(controllerComponents, paypalBackendProvider)
    )
}
