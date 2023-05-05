package config

import com.typesafe.config.Config
import config.ConfigImplicits._
import config.Configuration.IdentityUrl

class Identity(config: Config) {

  lazy val webappUrl = IdentityUrl(config.getString("webapp.url"))

  lazy val apiUrl = config.getString("api.url")

  lazy val apiClientToken = config.getString("api.token")

  lazy val testUserSecret = config.getString("test.users.secret")

  lazy val useStub = config.getOptionalBoolean("useStub").getOrElse(false)

  lazy val idTokenCookieName = config.getString("id.token.cookie.name")
  lazy val accessTokenCookieName = config.getString("access.token.cookie.name")

  lazy val oauthClientId = config.getString("oauth.client.id")
  lazy val oauthAuthorizeUrl = config.getString("oauth.authorize.url")
  lazy val oauthTokenUrl = config.getString("oauth.token.url")
  lazy val oauthCallbackUrl = config.getString("oauth.callback.url")
  lazy val oauthScopes = config.getString("oauth.scopes")
}
