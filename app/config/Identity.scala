package config

import com.typesafe.config.Config
import com.gu.identity.cookie.{PreProductionKeys, ProductionKeys}

class Identity(config: Config) {
  lazy val keys = if (config.getBoolean("production.keys")) new ProductionKeys else new PreProductionKeys

  lazy val webappUrl = config.getString("webapp.url")

  lazy val apiUrl = config.getString("api.url")

  lazy val apiClientToken = config.getString("api.token")

  lazy val testUserSecret = config.getString("test.users.secret")
}
