package wiring

import com.typesafe.scalalogging.StrictLogging
import play.api.ApplicationLoader.Context
import play.api._

class AppLoader extends ApplicationLoader with StrictLogging {

  override def load(context: Context): Application = {

    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }

    try {
      (new BuiltInComponentsFromContext(context) with AppComponents).application
    } catch {
      case err: Throwable => {
        logger.error("Could not start application", err)
        throw err
      }
    }
  }
}
