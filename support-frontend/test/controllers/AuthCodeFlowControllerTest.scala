package controllers

import config.Identity
import controllers.AuthCodeFlow.{FlashKey, SessionKey}
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar.mock
import play.api.http.HeaderNames.LOCATION
import play.api.libs.json.Json
import play.api.libs.ws.WSResponse
import play.api.mvc.Cookie
import play.api.mvc.Cookie.SameSite.Lax
import play.api.test.{FakeHeaders, FakeRequest, Helpers}
import play.api.test.Helpers._
import services.AsyncAuthenticationService

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class AuthCodeFlowControllerTest extends AnyWordSpec with Matchers {

  "authorize" should {
    "return redirect" in {
      val authService = mock[AsyncAuthenticationService]
      val config = mock[Identity]
      when(config.oauthClientId).thenReturn("clientId")
      when(config.oauthAuthorizeUrl).thenReturn("authServerUrl")
      when(config.oauthScopes).thenReturn("a b c")
      when(config.oauthCallbackUrl).thenReturn("redirectUrl")
      val controller = new AuthCodeFlowController(stubControllerComponents(), authService, config)
      val result = controller.authorize()(FakeRequest())
      status(result) mustEqual 303
      val locationHeader = headers(result).get(LOCATION).get
      locationHeader must startWith("authServerUrl?")
      locationHeader must include("state=")
      locationHeader must include("scope=a+b+c")
      locationHeader must include("client_id=clientId")
      locationHeader must include("code_challenge=")
      locationHeader must include("code_challenge_method=S256")
      locationHeader must include("response_type=code")
      locationHeader must include("prompt=none")
      locationHeader must include("redirect_uri=redirectUrl")
    }

    "return events redirect" in {

      /** /events is served from live.theguardian.com to avoid apps blocking the domain as an in app purchase. We should
        * redirect back to this domain.
        */
      val authService = mock[AsyncAuthenticationService]
      val config = mock[Identity]
      when(config.oauthClientId).thenReturn("clientId")
      when(config.oauthAuthorizeUrl).thenReturn("authServerUrl")
      when(config.oauthScopes).thenReturn("a b c")
      when(config.oauthCallbackUrl).thenReturn("redirectUrl")
      when(config.oauthEventsCallbackUrl).thenReturn("eventsRedirectUrl")
      val controller = new AuthCodeFlowController(stubControllerComponents(), authService, config)
      val result =
        controller.authorize()(FakeRequest().withHeaders(("Host", "live.theguardian.com")))
      status(result) mustEqual 303
      val locationHeader = headers(result).get(LOCATION).get
      locationHeader must include("redirect_uri=eventsRedirectUrl")
    }

    "return auth redirect from the observer subdomain to the correct location" in {
      val authService = mock[AsyncAuthenticationService]
      val config = mock[Identity]
      when(config.oauthClientId).thenReturn("clientId")
      when(config.oauthAuthorizeUrl).thenReturn("authServerUrl")
      when(config.oauthScopes).thenReturn("a b c")
      when(config.oauthCallbackUrl).thenReturn("https://support.theguardian.com/oauth/callback")
      when(config.oauthEventsCallbackUrl).thenReturn("https://live.theguardian.com/oauth/callback")
      when(config.oauthObserverCallbackUrl).thenReturn("https://observer.theguardian.com/oauth/callback")
      val controller = new AuthCodeFlowController(stubControllerComponents(), authService, config)

      val result =
        controller.authorize()(FakeRequest().withHeaders(("Host", "observer.theguardian.com")))

      status(result) mustEqual 303
      val locationHeader = headers(result).get(LOCATION).get
      locationHeader must include("redirect_uri=https%3A%2F%2Fobserver.theguardian.com%2Foauth%2Fcallback")
    }
  }

  "callback" should {

    "return redirect with cookies when serverside token call succeeds" in {
      val response = mock[WSResponse]
      when(response.status).thenReturn(200)
      when(response.json).thenReturn(Json.obj("id_token" -> "idToken", "access_token" -> "accessToken"))
      val authService = mock[AsyncAuthenticationService]
      when(authService.getTokens(any)).thenReturn(Future.successful(response))
      val config = mock[Identity]
      when(config.oauthClientId).thenReturn("clientId")
      when(config.oauthCallbackUrl).thenReturn("redirectUrl")
      when(config.idTokenCookieName).thenReturn("id_token")
      when(config.accessTokenCookieName).thenReturn("access_token")
      val controller = new AuthCodeFlowController(stubControllerComponents(), authService, config)
      val request = FakeRequest().withSession(
        SessionKey.originUrl -> "origin",
        SessionKey.referringUrl -> "referrer",
        SessionKey.codeVerifier -> "verifier",
        SessionKey.state -> "state",
      )
      val result =
        controller.callback(code = Some("code"), state = "state", error = None, errorDescription = None)(request)
      status(result) mustEqual 303
      headers(result).get(LOCATION) must contain("origin?pre-auth-ref=referrer")
      cookies(result).get(config.idTokenCookieName) must contain(
        Cookie(
          name = "id_token",
          value = "idToken",
          maxAge = Some(3600),
          secure = true,
          sameSite = Some(Lax),
          httpOnly = false,
        ),
      )
      cookies(result).get(config.accessTokenCookieName) must contain(
        Cookie(
          name = "access_token",
          value = "accessToken",
          maxAge = Some(3600),
          secure = true,
          sameSite = Some(Lax),
          httpOnly = false,
        ),
      )
      session(result).get(SessionKey.originUrl) must be(None)
      session(result).get(SessionKey.referringUrl) must be(None)
      session(result).get(SessionKey.codeVerifier) must be(None)
      session(result).get(SessionKey.state) must be(None)
      flash(result).get(FlashKey.authTried) must be(defined)
    }

    "return redirect without cookies when authorize call failed because user isn't signed in" in {
      val authService = mock[AsyncAuthenticationService]
      val config = mock[Identity]
      when(config.oauthCallbackUrl).thenReturn("redirectUrl")
      when(config.idTokenCookieName).thenReturn("id_token")
      when(config.accessTokenCookieName).thenReturn("access_token")
      val controller = new AuthCodeFlowController(stubControllerComponents(), authService, config)
      val request = FakeRequest().withSession(
        SessionKey.originUrl -> "origin",
        SessionKey.referringUrl -> "referrer",
        SessionKey.codeVerifier -> "verifier",
        SessionKey.state -> "state",
      )
      val result =
        controller.callback(
          code = None,
          state = "state",
          error = Some("login_required"),
          errorDescription = Some("error desc"),
        )(request)
      status(result) mustEqual 303
      headers(result).get(LOCATION) must contain("origin?pre-auth-ref=referrer")
      cookies(result).get(config.idTokenCookieName) must be(None)
      cookies(result).get(config.accessTokenCookieName) must be(None)
      session(result).get(SessionKey.originUrl) must be(None)
      session(result).get(SessionKey.referringUrl) must be(None)
      session(result).get(SessionKey.codeVerifier) must be(None)
      session(result).get(SessionKey.state) must be(None)
      flash(result).get(FlashKey.authTried) must be(defined)
    }

    "return bad request when authorize call failed because state in request's param doesn't match state in its session" in {
      val authService = mock[AsyncAuthenticationService]
      val config = mock[Identity]
      when(config.oauthCallbackUrl).thenReturn("redirectUrl")
      when(config.idTokenCookieName).thenReturn("id_token")
      when(config.accessTokenCookieName).thenReturn("access_token")
      val controller = new AuthCodeFlowController(stubControllerComponents(), authService, config)
      val request = FakeRequest().withSession(
        SessionKey.originUrl -> "origin",
        SessionKey.codeVerifier -> "verifier",
        SessionKey.state -> "state1",
      )
      val result =
        controller.callback(
          code = Some("code"),
          state = "state2",
          error = None,
          errorDescription = None,
        )(request)
      status(result) mustEqual 400
      cookies(result).get(config.idTokenCookieName) must be(None)
      cookies(result).get(config.accessTokenCookieName) must be(None)
      session(result).get(SessionKey.originUrl) must be(None)
      session(result).get(SessionKey.codeVerifier) must be(None)
      session(result).get(SessionKey.state) must be(None)
      flash(result).get(FlashKey.authTried) must be(None)
    }

    "return bad request when authorize call failed unexpectedly" in {
      val authService = mock[AsyncAuthenticationService]
      val config = mock[Identity]
      when(config.oauthCallbackUrl).thenReturn("redirectUrl")
      when(config.idTokenCookieName).thenReturn("id_token")
      when(config.accessTokenCookieName).thenReturn("access_token")
      val controller = new AuthCodeFlowController(stubControllerComponents(), authService, config)
      val request = FakeRequest().withSession(
        SessionKey.originUrl -> "origin",
        SessionKey.codeVerifier -> "verifier",
        SessionKey.state -> "state",
      )
      val result =
        controller.callback(
          code = None,
          state = "state",
          error = Some("unexpected"),
          errorDescription = Some("error desc"),
        )(request)
      status(result) mustEqual 400
      cookies(result).get(config.idTokenCookieName) must be(None)
      cookies(result).get(config.accessTokenCookieName) must be(None)
      session(result).get(SessionKey.originUrl) must be(None)
      session(result).get(SessionKey.codeVerifier) must be(None)
      session(result).get(SessionKey.state) must be(None)
      flash(result).get(FlashKey.authTried) must be(None)
    }
  }

  "AuthCodeFlow.replaceParam" should {
    "add new query where one doesn't exist" in {
      AuthCodeFlow.replaceParam("https://example.com", "param1", "value1") mustEqual "https://example.com?param1=value1"
    }
    "add new param to existing query" in {
      AuthCodeFlow.replaceParam(
        "https://example.com?param1=value1&param2=value2",
        "param3",
        "value3",
      ) mustEqual "https://example.com?param1=value1&param2=value2&param3=value3"
    }
    "replace existing value of param with new value" in {
      AuthCodeFlow.replaceParam(
        "https://example.com?param1=value1",
        "param1",
        "value2",
      ) mustEqual "https://example.com?param1=value2"
    }
    "replace existing value of param with new value where there are multiple params" in {
      AuthCodeFlow.replaceParam(
        "https://example.com?param1=value1&param2=value2",
        "param1",
        "value3",
      ) mustEqual "https://example.com?param2=value2&param1=value3"
    }
  }
}
