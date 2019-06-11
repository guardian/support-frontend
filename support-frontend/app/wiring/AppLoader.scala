package wiring

import java.io.File

import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import com.gu.conf.{ConfigurationLoader, FileConfigurationLocation, SSMConfigurationLocation}
import com.typesafe.scalalogging.StrictLogging
import play.api.ApplicationLoader.Context
import play.api._

class AppLoader extends ApplicationLoader with StrictLogging {

  private def getParameterStoreConfig(initialConfiguration: Configuration): Configuration = {
    val identity = AppIdentity.whoAmI(defaultAppName = "support-frontend")
    val loadedConfig = ConfigurationLoader.load(identity) {
      case AwsIdentity(app, stack, stage, _) => SSMConfigurationLocation(s"/$stack/$app/$stage")
      case DevIdentity(app) =>
        FileConfigurationLocation(new File(s"/etc/gu/support-frontend.private.conf"))  //assume conf is available locally
    }

    logger.info(loadedConfig.toString)

    initialConfiguration ++ Configuration(loadedConfig)
  }

  override def load(context: Context): Application = {

    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }

    val contextWithConfig = context.copy(initialConfiguration = getParameterStoreConfig(context.initialConfiguration))

    try {
      (new BuiltInComponentsFromContext(contextWithConfig) with AppComponents).application
    } catch {
      case err: Throwable => {
        logger.error("Could not start application", err)
        throw err
      }
    }
  }
}
