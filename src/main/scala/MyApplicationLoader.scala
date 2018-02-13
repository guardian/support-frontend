import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import play.api.{Application, ApplicationLoader, BuiltInComponentsFromContext, Configuration, NoHttpFiltersComponents}
import play.api.ApplicationLoader.Context
import play.api.db.{DBComponents, HikariCPComponents}
import router.Routes

import aws.AWSClientBuilder
import _root_.controllers.StripeController
import conf.{ConfigLoader, PlayConfigurationUpdater}
import model.RequestEnvironments
import services.AppServices

class MyApplicationLoader extends ApplicationLoader {
  def load(context: Context): Application = {
    // logging initialisation needs to happen here
    new MyComponents(context).application
  }
}

class MyComponents(context: Context)
  extends BuiltInComponentsFromContext(context)
  with DBComponents
  with NoHttpFiltersComponents
  with HikariCPComponents {

  val awsClientBuilder = new AWSClientBuilder(applicationLifecycle)
  val ssm: AWSSimpleSystemsManagement = awsClientBuilder.buildAWSSimpleSystemsManagementClient()
  val configLoader: ConfigLoader = new ConfigLoader(ssm)
  val requestEnvironments: RequestEnvironments = RequestEnvironments.forAppMode(isProd = false)

  val configurationUpdater = new PlayConfigurationUpdater(configLoader, requestEnvironments)

  override val configuration: Configuration = configurationUpdater
    .updatePlayConfiguration(super.configuration).valueOr(throw _)

  val appServices: AppServices = AppServices.build(configLoader, requestEnvironments).valueOr(throw _)

  override val router = new Routes(httpErrorHandler, new StripeController(controllerComponents, appServices.stripeServiceProvider))
}
