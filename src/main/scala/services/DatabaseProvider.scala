package services

import cats.data.Validated
import cats.syntax.apply._
import play.api.Configuration
import play.api.db.{DBApi, Database}

import conf.{ConfigLoader, DBConfig}
import model.{Environment, InitializationError, InitializationResult, RequestEnvironments}

class DatabaseProvider(dbApi: DBApi) {

  def loadDatabase(env: Environment): InitializationResult[Database] =
    Validated.catchNonFatal(dbApi.database(env.entryName)).leftMap { err =>
      InitializationError(s"unable to load data base for environment ${env.entryName}", err)
    }
}

object DatabaseProvider {

  object ConfigurationUpdater {

    private implicit class DBConfigOps(val config: DBConfig) extends AnyVal {

      // See https://www.playframework.com/documentation/2.6.x/SettingsJDBC
      def asConfiguration: Configuration = {
        import config._
        Configuration(
          "db" -> Map(
            env.entryName -> Map(
              "url" -> url,
              "driver" -> driver,
              "username" -> username,
              "password" -> password
            )
          )
        )
      }
    }

    // This should be used to override the Play configuration when injecting dependencies at compile time,
    // and called before the first call to DatabaseProvider.loadDatabase()
    // Otherwise, the dbApi val (which Play provides lazily) will be initialized without the sufficient config.
    def updateConfiguration(configLoader: ConfigLoader, configuration: Configuration, envs: RequestEnvironments): Configuration =
      (configLoader.loadConfig[DBConfig](envs.test), configLoader.loadConfig[DBConfig](envs.live))
        .mapN((testConfig, liveConfig) => configuration ++ testConfig.asConfiguration ++ liveConfig.asConfiguration)
        // Ok throwing an exception, since this method is called on the edge of the application
        .valueOr(err => throw InitializationError("unable to update Play config with database settings", err))
  }
}
