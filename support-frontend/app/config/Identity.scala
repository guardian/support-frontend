package config

import com.typesafe.config.Config
import config.ConfigImplicits._
import config.Configuration.IdentityUrl

class Identity(config: Config) {

  lazy val webappUrl: IdentityUrl = IdentityUrl(config.getString("webapp.url"))

  lazy val apiUrl: String = config.getString("api.url")

  lazy val apiClientToken: String = config.getString("api.token")

  lazy val testUserSecret: String = config.getString("test.users.secret")

  lazy val useStub: Boolean = config.getOptionalBoolean("useStub").getOrElse(false)

  // This cookie indicates that user is signed in
  lazy val signedInCookieName: String = config.getString("signed.in.cookie.name")

  // This cookie indicates that user has recently signed out
  lazy val signedOutCookieName: String = config.getString("signed.out.cookie.name")

  // These cookies are used to store OAuth tokens
  lazy val idTokenCookieName: String = config.getString("id.token.cookie.name")
  lazy val accessTokenCookieName: String = config.getString("access.token.cookie.name")

  lazy val oauthClientId: String = config.getString("oauth.client.id")
  lazy val oauthIssuerUrl: String = config.getString("oauth.issuer.url")
  lazy val oauthAudience: String = config.getString("oauth.audience")
  lazy val oauthAuthorizeUrl: String = config.getString("oauth.authorize.url")
  lazy val oauthTokenUrl: String = config.getString("oauth.token.url")
  lazy val oauthCallbackUrl: String = config.getString("oauth.callback.url")
  lazy val oauthEventsCallbackUrl: String = config.getString("oauth.eventsCallback.url")
  lazy val oauthScopes: String = config.getString("oauth.scopes")
}
