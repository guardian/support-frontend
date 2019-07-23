package config

import com.typesafe.config.Config
import com.gu.identity.cookie.{PreProductionKeys, ProductionKeys}
import config.ConfigImplicits._
import config.Configuration.IdentityUrl

class Identity(config: Config) {
  lazy val keys = if (config.getBoolean("production.keys")) new ProductionKeys else new PreProductionKeys

  lazy val webappUrl = IdentityUrl(config.getString("webapp.url"))

  lazy val apiUrl = config.getString("api.url")

  lazy val apiClientToken = config.getString("api.token")

  lazy val testUserSecret = config.getString("test.users.secret")

  lazy val useStub = config.getOptionalBoolean("useStub").getOrElse(false)
}
