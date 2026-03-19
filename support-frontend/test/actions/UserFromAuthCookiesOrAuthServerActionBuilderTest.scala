package actions

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.UserFromAuthCookiesActionBuilder.{ClientAccessScope, UserClaims}
import com.gu.identity.auth._
import config.Identity
import controllers.AuthCodeFlow.FlashKey.authTried
import controllers.AuthCodeFlow.SessionKey
import controllers.routes
import org.mockito.Mockito.when
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar.mock
import play.api.http.HeaderNames.REFERER
import play.api.libs.json.{JsNull, Json}
import play.api.mvc.Results._
import play.api.mvc.{AnyContent, BodyParser, Cookie}
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsJson, defaultAwaitTimeout, redirectLocation, session, status}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class UserFromAuthCookiesOrAuthServerActionBuilderTest extends AnyWordSpec with Matchers {

  private def toJson(request: OptionalAuthRequest[AnyContent]) =
    request.user.map(user => Json.obj("userId" -> user.id)).getOrElse(JsNull)

  private val accessToken = AccessToken("accessToken")
  private val idToken = IdToken("idToken")
  private val idClaims =
    UserClaims(primaryEmailAddress = "email", identityId = "id", firstName = None, lastName = None, iat = None)
  private val accessClaims = DefaultAccessClaims(primaryEmailAddress = "email", identityId = "id", username = None)
  private val accessScopes = "scope1 scope2 scope3"
  private val accessScopeList =
    List(ClientAccessScope("scope1"), ClientAccessScope("scope2"), ClientAccessScope("scope3"))
  private val idTokenCookieName = "guIdToken"
  private val accessTokenCookieName = "guAccessToken"
  private val signedInCookieName = "guu"
  private val signedInCookie = Cookie(name = signedInCookieName, value = "present")
  private val signedOutCookieName = "guso"

  "invokeBlock" when {

    "request has recently-signed-out cookie" must {
      val parser = mock[BodyParser[AnyContent]]
      val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
      val config = mock[Identity]
      when(config.signedInCookieName).thenReturn(signedInCookieName)
      when(config.signedOutCookieName).thenReturn(signedOutCookieName)
      when(config.oauthScopes).thenReturn(accessScopes)
      val request = FakeRequest().withCookies(Cookie(name = config.signedOutCookieName, value = "1684759360"))
      def block(request: OptionalAuthRequest[AnyContent]) = Future.successful(Ok(toJson(request)))
      val actionBuilder =
        new UserFromAuthCookiesOrAuthServerActionBuilder(
          parser,
          authService,
          config,
          isAuthServerUp = () => Future.successful(true),
        )
      val result = actionBuilder.invokeBlock(request, block)
      "give an OK response" in {
        status(result) mustBe 200
      }
      "provide no User instance to the wrapped block" in {
        contentAsJson(result) mustBe JsNull
      }
    }

    "request has no signed-in cookie" must {
      val parser = mock[BodyParser[AnyContent]]
      val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
      val config = mock[Identity]
      when(config.signedInCookieName).thenReturn(signedInCookieName)
      when(config.signedOutCookieName).thenReturn(signedOutCookieName)
      val request = FakeRequest()
      def block(request: OptionalAuthRequest[AnyContent]) = Future.successful(Ok(toJson(request)))
      val actionBuilder =
        new UserFromAuthCookiesOrAuthServerActionBuilder(
          parser,
          authService,
          config,
          isAuthServerUp = () => Future.successful(true),
        )
      val result = actionBuilder.invokeBlock(request, block)
      "give an OK response" in {
        status(result) mustBe 200
      }
      "provide no User instance to the wrapped block" in {
        contentAsJson(result) mustBe JsNull
      }
    }

    "request has no token cookies" must {
      val parser = mock[BodyParser[AnyContent]]
      val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
      val config = mock[Identity]
      when(config.oauthScopes).thenReturn(accessScopes)
      when(config.signedInCookieName).thenReturn(signedInCookieName)
      when(config.signedOutCookieName).thenReturn(signedOutCookieName)
      val request = FakeRequest()
        .withHeaders(REFERER -> "referrer")
        .withCookies(signedInCookie)
      def block(request: OptionalAuthRequest[AnyContent]) = Future.successful(Ok(toJson(request)))
      val actionBuilder =
        new UserFromAuthCookiesOrAuthServerActionBuilder(
          parser,
          authService,
          config,
          isAuthServerUp = () => Future.successful(true),
        )
      val result = actionBuilder.invokeBlock(request, block)
      "be a redirect" in {
        status(result) mustBe 303
      }
      "redirect to authorize endpoint" in {
        redirectLocation(result) mustBe Some(routes.AuthCodeFlowController.authorize().url)
      }
      "include origin URL in response session" in {
        session(result).get(SessionKey.originUrl) mustBe Some(request.uri)
      }
      "include referrer URL in response session" in {
        session(result).get(SessionKey.referringUrl) mustBe request.headers.get(REFERER)
      }
    }

    "request has no ID token cookie" must {
      val parser = mock[BodyParser[AnyContent]]
      val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
      val config = mock[Identity]
      when(config.oauthScopes).thenReturn(accessScopes)
      when(config.signedInCookieName).thenReturn(signedInCookieName)
      when(config.signedOutCookieName).thenReturn(signedOutCookieName)
      when(config.idTokenCookieName).thenReturn(idTokenCookieName)
      when(config.accessTokenCookieName).thenReturn(accessTokenCookieName)
      val request = FakeRequest()
        .withHeaders(REFERER -> "referrer")
        .withCookies(
          signedInCookie,
          Cookie(name = config.accessTokenCookieName, value = accessToken.value),
        )
      def block(request: OptionalAuthRequest[AnyContent]) = Future.successful(Ok(toJson(request)))
      val actionBuilder =
        new UserFromAuthCookiesOrAuthServerActionBuilder(
          parser,
          authService,
          config,
          isAuthServerUp = () => Future.successful(true),
        )
      val result = actionBuilder.invokeBlock(request, block)
      "be a redirect" in {
        status(result) mustBe 303
      }
      "redirect to authorize endpoint" in {
        redirectLocation(result) mustBe Some(routes.AuthCodeFlowController.authorize().url)
      }
      "include origin URL in response session" in {
        session(result).get(SessionKey.originUrl) mustBe Some(request.uri)
      }
      "include referrer URL in response session" in {
        session(result).get(SessionKey.referringUrl) mustBe request.headers.get(REFERER)
      }
    }

    "request has no access token cookie" must {
      val parser = mock[BodyParser[AnyContent]]
      val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
      when(authService.validateIdTokenLocally(idToken, nonce = None)).thenReturn(Right(idClaims))
      val config = mock[Identity]
      when(config.oauthScopes).thenReturn(accessScopes)
      when(config.signedInCookieName).thenReturn(signedInCookieName)
      when(config.signedOutCookieName).thenReturn(signedOutCookieName)
      when(config.idTokenCookieName).thenReturn(idTokenCookieName)
      when(config.accessTokenCookieName).thenReturn(accessTokenCookieName)
      val request = FakeRequest()
        .withHeaders(REFERER -> "referrer")
        .withCookies(
          signedInCookie,
          Cookie(name = config.idTokenCookieName, value = idToken.value),
        )
      def block(request: OptionalAuthRequest[AnyContent]) = Future.successful(Ok(toJson(request)))
      val actionBuilder =
        new UserFromAuthCookiesOrAuthServerActionBuilder(
          parser,
          authService,
          config,
          isAuthServerUp = () => Future.successful(true),
        )
      val result = actionBuilder.invokeBlock(request, block)
      "be a redirect" in {
        status(result) mustBe 303
      }
      "redirect to authorize endpoint" in {
        redirectLocation(result) mustBe Some(routes.AuthCodeFlowController.authorize().url)
      }
      "include origin URL in response session" in {
        session(result).get(SessionKey.originUrl) mustBe Some(request.uri)
      }
      "include referrer URL in response session" in {
        session(result).get(SessionKey.referringUrl) mustBe request.headers.get(REFERER)
      }
    }

    "request has both ID and access token cookies and they contain valid tokens" must {
      val parser = mock[BodyParser[AnyContent]]
      val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
      when(authService.validateIdTokenLocally(idToken, nonce = None)).thenReturn(Right(idClaims))
      when(authService.validateAccessTokenLocally(accessToken, accessScopeList)).thenReturn(Right(accessClaims))
      val config = mock[Identity]
      when(config.oauthScopes).thenReturn(accessScopes)
      when(config.signedInCookieName).thenReturn(signedInCookieName)
      when(config.signedOutCookieName).thenReturn(signedOutCookieName)
      when(config.idTokenCookieName).thenReturn(idTokenCookieName)
      when(config.accessTokenCookieName).thenReturn(accessTokenCookieName)
      val request = FakeRequest().withCookies(
        signedInCookie,
        Cookie(name = config.idTokenCookieName, value = idToken.value),
        Cookie(name = config.accessTokenCookieName, value = accessToken.value),
      )
      val actionBuilder =
        new UserFromAuthCookiesOrAuthServerActionBuilder(
          parser,
          authService,
          config,
          isAuthServerUp = () => Future.successful(true),
        )
      def block(request: OptionalAuthRequest[AnyContent]) = Future.successful(Ok(toJson(request)))
      val result = actionBuilder.invokeBlock(request, block)
      "give an OK response" in {
        status(result) mustBe 200
      }
      "provide a User instance to the wrapped block" in {
        contentAsJson(result) mustBe Json.obj("userId" -> "id")
      }
    }

    "request has both ID and access token cookies but one is invalid" must {
      val parser = mock[BodyParser[AnyContent]]
      val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
      when(authService.validateIdTokenLocally(idToken, nonce = None)).thenReturn(Right(idClaims))
      when(authService.validateAccessTokenLocally(accessToken, accessScopeList)).thenReturn(Left(InvalidOrExpiredToken))
      val config = mock[Identity]
      when(config.oauthScopes).thenReturn(accessScopes)
      when(config.signedInCookieName).thenReturn(signedInCookieName)
      when(config.signedOutCookieName).thenReturn(signedOutCookieName)
      when(config.idTokenCookieName).thenReturn(idTokenCookieName)
      when(config.accessTokenCookieName).thenReturn(accessTokenCookieName)
      val request = FakeRequest()
        .withHeaders(REFERER -> "referrer")
        .withCookies(
          signedInCookie,
          Cookie(name = config.idTokenCookieName, value = idToken.value),
          Cookie(name = config.accessTokenCookieName, value = accessToken.value),
        )
      def block(request: OptionalAuthRequest[AnyContent]) = Future.successful(Ok(toJson(request)))
      val actionBuilder =
        new UserFromAuthCookiesOrAuthServerActionBuilder(
          parser,
          authService,
          config,
          isAuthServerUp = () => Future.successful(true),
        )
      val result = actionBuilder.invokeBlock(request, block)
      "be a redirect" in {
        status(result) mustBe 303
      }
      "redirect to authorize endpoint" in {
        redirectLocation(result) mustBe Some(routes.AuthCodeFlowController.authorize().url)
      }
      "include origin URL in response session" in {
        session(result).get(SessionKey.originUrl) mustBe Some(request.uri)
      }
      "include referrer URL in response session" in {
        session(result).get(SessionKey.referringUrl) mustBe request.headers.get(REFERER)
      }
    }

    "request has both ID and access token cookies but both are invalid and we've already tried to authenticate" must {
      val parser = mock[BodyParser[AnyContent]]
      val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
      when(authService.validateIdTokenLocally(idToken, nonce = None)).thenReturn(Left(InvalidOrExpiredToken))
      when(authService.validateAccessTokenLocally(accessToken, Nil)).thenReturn(Left(InvalidOrExpiredToken))
      val config = mock[Identity]
      when(config.oauthScopes).thenReturn(accessScopes)
      when(config.idTokenCookieName).thenReturn(idTokenCookieName)
      when(config.accessTokenCookieName).thenReturn(accessTokenCookieName)
      val request = FakeRequest()
        .withCookies(
          Cookie(name = config.idTokenCookieName, value = idToken.value),
          Cookie(name = config.accessTokenCookieName, value = accessToken.value),
        )
        .withFlash(authTried -> "true")
      def block(request: OptionalAuthRequest[AnyContent]) = Future.successful(Ok(toJson(request)))
      val actionBuilder =
        new UserFromAuthCookiesOrAuthServerActionBuilder(
          parser,
          authService,
          config,
          isAuthServerUp = () => Future.successful(true),
        )
      val result = actionBuilder.invokeBlock(request, block)
      "give an OK response" in {
        status(result) mustBe 200
      }
      "provide no User instance to the wrapped block" in {
        contentAsJson(result) mustBe JsNull
      }
      "give a response with a clean session" in {
        session(result).isEmpty mustBe true
      }
    }

    "auth server is down" must {
      val parser = mock[BodyParser[AnyContent]]
      val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
      when(authService.validateIdTokenLocally(idToken, nonce = None)).thenReturn(Left(InvalidOrExpiredToken))
      when(authService.validateAccessTokenLocally(accessToken, Nil)).thenReturn(Left(InvalidOrExpiredToken))
      val config = mock[Identity]
      when(config.oauthScopes).thenReturn(accessScopes)
      when(config.idTokenCookieName).thenReturn(idTokenCookieName)
      when(config.accessTokenCookieName).thenReturn(accessTokenCookieName)
      val request = FakeRequest()
        .withCookies(
          Cookie(name = config.idTokenCookieName, value = idToken.value),
          Cookie(name = config.accessTokenCookieName, value = accessToken.value),
        )
      def block(request: OptionalAuthRequest[AnyContent]) = Future.successful(Ok(toJson(request)))
      val actionBuilder =
        new UserFromAuthCookiesOrAuthServerActionBuilder(
          parser,
          authService,
          config,
          isAuthServerUp = () => Future.successful(false),
        )
      val result = actionBuilder.invokeBlock(request, block)
      "give an OK response" in {
        status(result) mustBe 200
      }
      "provide no User instance to the wrapped block" in {
        contentAsJson(result) mustBe JsNull
      }
      "give a response with a clean session" in {
        session(result).isEmpty mustBe true
      }
    }

    "request has no referrer" must {
      val parser = mock[BodyParser[AnyContent]]
      val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
      val config = mock[Identity]
      when(config.oauthScopes).thenReturn(accessScopes)
      when(config.signedInCookieName).thenReturn(signedInCookieName)
      when(config.signedOutCookieName).thenReturn(signedOutCookieName)
      val request = FakeRequest().withCookies(signedInCookie)
      def block(request: OptionalAuthRequest[AnyContent]) = Future.successful(Ok(toJson(request)))
      val actionBuilder =
        new UserFromAuthCookiesOrAuthServerActionBuilder(
          parser,
          authService,
          config,
          isAuthServerUp = () => Future.successful(true),
        )
      val result = actionBuilder.invokeBlock(request, block)
      "be a redirect" in {
        status(result) mustBe 303
      }
      "redirect to authorize endpoint" in {
        redirectLocation(result) mustBe Some(routes.AuthCodeFlowController.authorize().url)
      }
      "include origin URL in response session" in {
        session(result).get(SessionKey.originUrl) mustBe Some(request.uri)
      }
      "not include referrer URL in response session" in {
        session(result).get(SessionKey.referringUrl) mustBe None
      }
    }
  }

  "UserClaims.fromDefaultAndUnparsed" when {
    "no raw claims" must {
      "fail with missing required claim" in {
        UserClaims.parser.fromUnparsed(UnparsedClaims(rawClaims = Map())) mustBe Left(MissingRequiredClaim("email"))
      }
    }
    "all required raw claims" must {
      "give partially filled UserClaims" in {
        UserClaims.parser.fromUnparsed(
          UnparsedClaims(rawClaims = Map("email" -> "eml", "legacy_identity_id" -> "idid")),
        ) mustBe Right(
          UserClaims(
            primaryEmailAddress = "eml",
            identityId = "idid",
            firstName = None,
            lastName = None,
            iat = None,
          ),
        )
      }
    }
    "all raw claims" must {
      "give complete UserClaims" in {
        UserClaims.parser.fromUnparsed(
          UnparsedClaims(rawClaims =
            Map(
              "email" -> "eml",
              "legacy_identity_id" -> "idid",
              "username" -> "un",
              "first_name" -> "fn",
              "last_name" -> "sn",
              "iat" -> 123456.asInstanceOf[AnyRef],
            ),
          ),
        ) mustBe Right(
          UserClaims(
            primaryEmailAddress = "eml",
            identityId = "idid",
            firstName = Some("fn"),
            lastName = Some("sn"),
            iat = Some(123456),
          ),
        )
      }
    }
  }
}
