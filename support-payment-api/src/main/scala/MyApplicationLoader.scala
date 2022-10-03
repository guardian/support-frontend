import _root_.controllers._
import akka.actor.ActorSystem
import aws.AWSClientBuilder
import backend._
import com.amazon.pay.impl.ipn.NotificationFactory
import com.amazon.pay.response.ipn.model.Notification
import com.amazonaws.services.cloudwatch.AmazonCloudWatchAsync
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import com.typesafe.scalalogging.StrictLogging
import conf.{ConfigLoader, PlayConfigUpdater}
import model.{AppThreadPools, AppThreadPoolsProvider, RequestEnvironments}
import play.api.ApplicationLoader.Context
import play.api._
import play.api.db.{DBComponents, HikariCPComponents}
import play.api.libs.ws.WSClient
import play.api.libs.ws.ahc.AhcWSComponents
import router.Routes
import services.CloudWatchService
import util.RequestBasedProvider

import scala.jdk.CollectionConverters._

class MyApplicationLoader extends ApplicationLoader with StrictLogging {
  def load(context: Context): Application = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment, context.initialConfiguration, Map.empty)
    }

    try {
      new MyComponents(context).application
    } catch {
      case err: Throwable => {
        logger.error("Could not start application", err)
        throw err
      }
    }
  }
}

class MyComponents(context: Context)
    extends BuiltInComponentsFromContext(context)
    with DBComponents
    with NoHttpFiltersComponents
    with HikariCPComponents
    with AhcWSComponents
    with AppThreadPoolsProvider
    with StrictLogging {

  // At this point, the app either gets two request environments that differ
  // (Live and Test), or two that are the same (Test and Test).
  // This will determine, later on, whether passing the "?mode=test" param has any effect
  val requestEnvironments: RequestEnvironments = RequestEnvironments.fromAppStage

  val ssm: AWSSimpleSystemsManagement = AWSClientBuilder.buildAWSSimpleSystemsManagementClient()

  val configLoader: ConfigLoader = new ConfigLoader(ssm)
  val playConfigUpdater = new PlayConfigUpdater(configLoader)

  // I guess it could be nice if a given config knew whether it was
  // request-environment-dependent or app-mode-dependent
  override val configuration: Configuration = playConfigUpdater
    .updateConfiguration(super.configuration, requestEnvironments, environment.mode)
    .valueOr(throw _)

  override val threadPools: AppThreadPools = AppThreadPools.load(executionContext, actorSystem).valueOr(throw _)

  implicit val _wsClient: WSClient = wsClient
  implicit val s3Client: AmazonS3 = AWSClientBuilder.buildS3Client()
  private implicit val system: ActorSystem = ActorSystem()

  override lazy val httpErrorHandler = new ErrorHandler(environment, configuration, sourceMapper, Some(router))

  val cloudWatchClient: AmazonCloudWatchAsync = AWSClientBuilder.buildCloudWatchAsyncClient()

  val stripeBackendProvider: RequestBasedProvider[StripeBackend] =
    new StripeBackend.Builder(configLoader, cloudWatchClient)
      .buildRequestBasedProvider(requestEnvironments)
      .valueOr(throw _)

  val paypalBackendProvider: RequestBasedProvider[PaypalBackend] =
    new PaypalBackend.Builder(configLoader, cloudWatchClient)
      .buildRequestBasedProvider(requestEnvironments)
      .valueOr(throw _)

  val goCardlessBackendProvider: RequestBasedProvider[GoCardlessBackend] =
    new GoCardlessBackend.Builder(configLoader, cloudWatchClient)
      .buildRequestBasedProvider(requestEnvironments)
      .valueOr(throw _)

  val amazonPayBackendProvider: RequestBasedProvider[AmazonPayBackend] =
    new AmazonPayBackend.Builder(configLoader, cloudWatchClient)
      .buildRequestBasedProvider(requestEnvironments)
      .valueOr(throw _)

  implicit val allowedCorsUrl = configuration.get[Seq[String]](s"cors.allowedOrigins").toList

  // Usually the cloudWatchService is determined based on the request (live vs test). But inside the controllers
  // we may not know the environment, so we just use live. Note - in DEV/CODE, there is no difference between test/live
  val liveCloudWatchService = new CloudWatchService(cloudWatchClient, requestEnvironments.live)

  def parseNotification(headers: Map[String, String], body: String): Notification =
    NotificationFactory.parseNotification(headers.asJava, body)

  override val router =
    new Routes(
      httpErrorHandler,
      new AppController(controllerComponents),
      new StripeController(controllerComponents, stripeBackendProvider, liveCloudWatchService),
      new PaypalController(controllerComponents, paypalBackendProvider),
      new GoCardlessController(controllerComponents, goCardlessBackendProvider),
      new AmazonPayController(controllerComponents, amazonPayBackendProvider, parseNotification),
    )
}
