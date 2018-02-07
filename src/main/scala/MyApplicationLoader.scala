import cats.syntax.either._
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import play.api.ApplicationLoader.Context
import play.api.db.{DBComponents, HikariCPComponents}
import play.api.{ApplicationLoader, BuiltInComponentsFromContext, Configuration, NoHttpFiltersComponents}
import router.Routes

import aws.AWSClientBuilder
import conf._
import model.Environment

class MyApplicationLoader extends ApplicationLoader {
  def load(context: Context) = {
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
  val configLoader = new ParameterStoreConfigLoader(ssm)
  val dbConfig: DBConfig = configLoader.loadConfig[DBConfig](Environment.Test).valueOr(throw _)

  println(dbConfig)

  val paypalConfig: PaypalConfig = configLoader.loadConfig[PaypalConfig](Environment.Test).valueOr(throw _)

  println(paypalConfig)

  override val configuration: Configuration = ConfigurationUpdater.updateConfiguration(super.configuration, dbConfig)

  println(configuration.get[Configuration]("db"))

  override val router = new Routes(httpErrorHandler, new controllers.StripeController(controllerComponents, configuration))
}
