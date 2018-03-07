package services

import cats.data.Validated
import play.api.Configuration
import play.api.db.{DBApi, Database}

import conf.DBConfig
import model.{Environment, InitializationError, InitializationResult}

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
  }
}
