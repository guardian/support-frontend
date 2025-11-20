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

  // This cookie indicates that user is signed in
  lazy val signedInCookieName = config.getString("signed.in.cookie.name")

  // This cookie indicates that user has recently signed out
  lazy val signedOutCookieName = config.getString("signed.out.cookie.name")

  // These cookies are used to store OAuth tokens
  lazy val idTokenCookieName = config.getString("id.token.cookie.name")
  lazy val accessTokenCookieName = config.getString("access.token.cookie.name")

  lazy val oauthClientId = config.getString("oauth.client.id")
  lazy val oauthIssuerUrl = config.getString("oauth.issuer.url")
  lazy val oauthAudience = config.getString("oauth.audience")
  lazy val oauthAuthorizeUrl = config.getString("oauth.authorize.url")
  lazy val oauthTokenUrl = config.getString("oauth.token.url")
  lazy val oauthCallbackUrl = config.getString("oauth.callback.url")
  lazy val oauthEventsCallbackUrl = config.getString("oauth.eventsCallback.url")
  lazy val oauthObserverCallbackUrl = config.getString("oauth.observerCallback.url")
  lazy val oauthScopes = config.getString("oauth.scopes")
}
