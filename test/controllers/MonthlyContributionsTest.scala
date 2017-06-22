package controllers

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.ExecutionContext.Implicits.global
import cats.data.EitherT
import cats.implicits._
import org.scalatest.mockito.MockitoSugar._
import org.scalatest.{MustMatchers, WordSpec}
import org.scalatest.OptionValues._
import org.mockito.Mockito.when
import org.mockito.ArgumentMatchers.{any, eq => argEq}
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.mvc.{RequestHeader, Result}
import play.api.Environment
import assets.AssetsResolver
import com.gu.identity.play.PublicFields
import com.gu.identity.play.{AccessCredentials, AuthenticatedIdUser, IdMinimalUser, IdUser}
import lib.TestUsers
import lib.actions.ActionRefiners
import lib.stepfunctions.MonthlyContributionsClient
import services.{IdentityService, MembersDataService}
import services.MembersDataService._

class MonthlyContributionsTest extends WordSpec with MustMatchers {

  "GET /monthly-contributors" should {

    "redirect unauthenticated user to signup page" in new DisplayForm {
      val result = fakeRequestWith(actionRefiner = loggedOutActionRefiner)
      status(result) mustBe 303
      header("Location", result).value must startWith("https://identity-url.local")
    }

    "return internal server error if identity does not return user info" in new DisplayForm {
      val result = fakeRequestWith(
        identityService = mockedIdentityService(authenticatedIdUser.user -> "not found".asLeft)
      )
      status(result) mustBe 500
    }

    "redirect to existing-contributor page if user is already a contributor" in new DisplayForm {
      val attributes = UserAttributes("123", ContentAccess(recurringContributor = true))
      val result = fakeRequestWith(
        membersDataService = mockedMembersDataService(credentials -> attributes.asRight)
      )
      status(result) mustBe 303
      header("Location", result) mustBe Some("/monthly-contributions/existing-contributor")
    }

    "return form if user is not in members api" in new DisplayForm {
      val result = fakeRequestWith(
        membersDataService = mockedMembersDataService(credentials -> (UserNotFound: MembersDataServiceError).asLeft)
      )
      status(result) mustBe 200
      contentAsString(result) must include("monthlyContributionsPage.js")
    }

    "return form if members api fails" in new DisplayForm {
      val result = fakeRequestWith(
        membersDataService = mockedMembersDataService(credentials -> (UnexpectedResponseStatus(100): MembersDataServiceError).asLeft)
      )
      status(result) mustBe 200
      contentAsString(result) must include("monthlyContributionsPage.js")
    }

    "return form if user is not a recurring contributor" in new DisplayForm {
      val attributes = UserAttributes("123", ContentAccess(recurringContributor = false))
      val result = fakeRequestWith(
        membersDataService = mockedMembersDataService(credentials -> attributes.asRight)
      )
      status(result) mustBe 200
      contentAsString(result) must include("monthlyContributionsPage.js")
    }

    trait DisplayForm {
      val credentials = AccessCredentials.Cookies("", None)

      val authenticatedIdUser = AuthenticatedIdUser(credentials, IdMinimalUser("123", Some("test-user")))

      private val testUsers = new TestUsers("test") {
        override def isTestUser(displayName: Option[String]): Boolean = displayName.exists(_.startsWith("test"))
      }

      private val assetResolver = new AssetsResolver("", "", mock[Environment]) {
        override def apply(path: String): String = path
      }

      private val idUser = IdUser("123", "test@gu.com", PublicFields(Some("test-user")), None, None)

      private val loggedInActionRefiner = new ActionRefiners(_ => Some(authenticatedIdUser), "", "", testUsers)

      val loggedOutActionRefiner = new ActionRefiners(_ => None, "https://identity-url.local", "", testUsers)

      def mockedMembersDataService(data: (AccessCredentials.Cookies, Either[MembersDataServiceError, UserAttributes])): MembersDataService = {
        val membersDataService = mock[MembersDataService]
        when(
          membersDataService.userAttributes(data._1)
        ).thenReturn(EitherT.fromEither[Future](data._2))
        membersDataService
      }

      def mockedIdentityService(data: (IdMinimalUser, Either[String, IdUser])): IdentityService = {
        val m = mock[IdentityService]
        when(
          m.getUser(argEq(data._1))(any[RequestHeader], any[ExecutionContext])
        ).thenReturn(EitherT.fromEither[Future](data._2))
        m
      }

      def fakeRequestWith(
        actionRefiner: ActionRefiners = loggedInActionRefiner,
        identityService: IdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String]),
        membersDataService: MembersDataService = mock[MembersDataService]
      ): Future[Result] = {
        new MonthlyContributions()(
          mock[MonthlyContributionsClient],
          assetResolver,
          actionRefiner,
          global,
          membersDataService,
          identityService,
          testUsers
        ).displayForm(FakeRequest())
      }
    }
  }
}
