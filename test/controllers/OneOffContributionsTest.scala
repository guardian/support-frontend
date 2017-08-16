package controllers

import actions.CustomActionBuilders

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.ExecutionContext.Implicits.global
import cats.data.EitherT
import cats.implicits._
import org.scalatest.mockito.MockitoSugar._
import org.scalatest.{MustMatchers, WordSpec}
import org.mockito.Mockito.when
import org.mockito.ArgumentMatchers.{any, eq => argEq}
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.mvc.{AnyContent, RequestHeader, Result}
import play.api.Environment
import assets.AssetsResolver
import com.gu.googleauth.AuthAction
import com.gu.identity.play.{PrivateFields, PublicFields}
import com.gu.identity.play.{AccessCredentials, AuthenticatedIdUser, IdMinimalUser, IdUser}
import services.{IdentityService, TestUserService}
import com.gu.support.config.StripeConfigProvider
import fixtures.TestCSRFComponents
import play.api.libs.json.JsString

class OneOffContributionsTest extends WordSpec with MustMatchers with TestCSRFComponents {

  "GET /contribute/one-off" should {

    "return email address" in new AutoFillScope {
      val result = fakeRequest()
      status(result) mustBe 200
      (contentAsJson(result) \ "email").get mustEqual JsString("scott@gu.com")
    }

    "return full name" in new AutoFillScope {
      val result = fakeRequest()
      status(result) mustBe 200
      (contentAsJson(result) \ "name").get mustEqual JsString("Charles Scott")
    }

    trait AutoFillScope {
      private val credentials = AccessCredentials.Cookies("", None)

      private val authenticatedIdUser = AuthenticatedIdUser(credentials, IdMinimalUser("123", Some("test-user")))

      private val testUsers = new TestUserService("test") {
        override def isTestUser(displayName: Option[String]): Boolean = false
      }

      private val assetResolver = new AssetsResolver("", "", mock[Environment]) {
        override def apply(path: String): String = path
      }

      private val idUser = IdUser(
        id = "123",
        primaryEmailAddress = "scott@gu.com",
        PublicFields(Some("test-user")),
        Some(PrivateFields(firstName = Some("Charles"), secondName = Some("Scott"))),
        statusFields = None
      )

      private val loggedInActionRefiner = new CustomActionBuilders(
        authenticatedIdUserProvider = _ => Some(authenticatedIdUser),
        idWebAppUrl = "",
        supportUrl = "",
        testUsers = testUsers,
        cc = stubControllerComponents(),
        addToken = csrfAddToken,
        checkToken = csrfCheck,
        csrfConfig = csrfConfig
      )

      private def mockedIdentityService(data: (IdMinimalUser, Either[String, IdUser])): IdentityService = {
        val m = mock[IdentityService]
        when(
          m.getUser(argEq(data._1))(any[RequestHeader], any[ExecutionContext])
        ).thenReturn(EitherT.fromEither[Future](data._2))
        m
      }

      def fakeRequest(): Future[Result] = {
        val identityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String])

        new OneOffContributions(
          assetResolver,
          loggedInActionRefiner,
          identityService,
          testUsers,
          mock[StripeConfigProvider],
          "",
          "",
          mock[AuthAction[AnyContent]],
          stubControllerComponents()
        ).autofill(FakeRequest())
      }
    }
  }
}
