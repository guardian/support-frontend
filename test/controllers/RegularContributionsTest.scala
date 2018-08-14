package controllers

import actions.CustomActionBuilders

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
import services.stepfunctions.RegularContributionsClient
import services.{HttpIdentityService, MembersDataService, TestUserService}
import services.MembersDataService._
import com.gu.support.config._
import fixtures.TestCSRFComponents
import switchboard.SwitchState.On
import switchboard.{PaymentMethodsSwitch, Switches}

class RegularContributionsTest extends WordSpec with MustMatchers with TestCSRFComponents {

  trait DisplayForm {
    val credentials = AccessCredentials.Cookies("", None)

    val authenticatedIdUser = AuthenticatedIdUser(credentials, IdMinimalUser("123", Some("test-user")))

    private val testUsers = new TestUserService("test") {
      override def isTestUser(displayName: Option[String]): Boolean = displayName.exists(_.startsWith("test"))
    }

    private val assetResolver = new AssetsResolver("", "", mock[Environment]) {
      override def apply(path: String): String = path
    }

    private val idUser = IdUser("123", "test@gu.com", PublicFields(Some("test-user")), None, None)

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

    val loggedOutActionRefiner = new CustomActionBuilders(
      authenticatedIdUserProvider = _ => None,
      idWebAppUrl = "https://identity-url.local",
      supportUrl = "",
      testUsers = testUsers,
      cc = stubControllerComponents(),
      addToken = csrfAddToken,
      checkToken = csrfCheck,
      csrfConfig = csrfConfig
    )

    def mockedMembersDataService(data: (AccessCredentials.Cookies, Either[MembersDataServiceError, UserAttributes])): MembersDataService = {
      val membersDataService = mock[MembersDataService]
      when(
        membersDataService.userAttributes(data._1)
      ).thenReturn(EitherT.fromEither[Future](data._2))
      membersDataService
    }

    def mockedIdentityService(data: (IdMinimalUser, Either[String, IdUser])): HttpIdentityService = {
      val m = mock[HttpIdentityService]
      when(
        m.getUser(argEq(data._1))(any[RequestHeader], any[ExecutionContext])
      ).thenReturn(EitherT.fromEither[Future](data._2))
      m
    }

    def fakeRegularContributions(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: HttpIdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String]),
      membersDataService: MembersDataService = mock[MembersDataService]
    ): RegularContributions = {
      val stripeConfigProvider = mock[StripeConfigProvider]
      val payPalConfigProvider = mock[PayPalConfigProvider]
      when(stripeConfigProvider.get(any[Boolean]))
        .thenReturn(
          StripeConfig(StripeAccountConfig("test-key", "test-key"), StripeAccountConfig("test-key", "test-key"))
        )
      when(payPalConfigProvider.get(any[Boolean])).thenReturn(PayPalConfig(
        payPalEnvironment = "",
        NVPVersion = "",
        url = "",
        user = "",
        password = "",
        signature = ""
      ))

      new RegularContributions(
        mock[RegularContributionsClient],
        assetResolver,
        actionRefiner,
        membersDataService,
        identityService,
        testUsers,
        stripeConfigProvider,
        payPalConfigProvider,
        stubControllerComponents(),
        Switches(PaymentMethodsSwitch(On, On, None), PaymentMethodsSwitch(On, On, Some(On)), Map.empty, On, On),
        guardianDomain = ".thegulocal.com"
      )
    }

    def fakeRequestAuthenticatedWith(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: HttpIdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String]),
      membersDataService: MembersDataService = mock[MembersDataService]
    ): Future[Result] = {
      fakeRegularContributions(actionRefiner, identityService, membersDataService).displayFormAuthenticated()(FakeRequest())
    }

    def fakeRequestMaybeAuthenticatedWith(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: HttpIdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String]),
      membersDataService: MembersDataService = mock[MembersDataService]
    ): Future[Result] = {
      fakeRegularContributions(actionRefiner, identityService, membersDataService).displayFormMaybeAuthenticated()(FakeRequest())
    }
  }

  "GET /contribute/recurring" should {

    "redirect unauthenticated user to signup page" in new DisplayForm {
      val result = fakeRequestAuthenticatedWith(actionRefiner = loggedOutActionRefiner)
      status(result) mustBe 303
      header("Location", result).value must startWith("https://identity-url.local")
    }

    "return internal server error if identity does not return user info" in new DisplayForm {
      val result = fakeRequestAuthenticatedWith(
        identityService = mockedIdentityService(authenticatedIdUser.user -> "not found".asLeft)
      )
      status(result) mustBe 500
    }

    "redirect to existing-contributor page if user is already a contributor" in new DisplayForm {
      val attributes = UserAttributes("123", ContentAccess(recurringContributor = true))
      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> attributes.asRight)
      )
      status(result) mustBe 303
      header("Location", result) mustBe Some("/contribute/recurring/existing")
    }

    "return form if user is not in members api" in new DisplayForm {
      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> (UserNotFound: MembersDataServiceError).asLeft)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }

    "return form if members api fails" in new DisplayForm {
      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> (UnexpectedResponseStatus(100): MembersDataServiceError).asLeft)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }

    "return form if user is not a recurring contributor" in new DisplayForm {
      val attributes = UserAttributes("123", ContentAccess(recurringContributor = false))
      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> attributes.asRight)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }
  }

  "GET /contribute/recurring-guest when signed in" should {

    "return internal server error if identity does not return user info" in new DisplayForm {
      val result = fakeRequestMaybeAuthenticatedWith(
        identityService = mockedIdentityService(authenticatedIdUser.user -> "not found".asLeft)
      )
      status(result) mustBe 500
    }

    "redirect to existing-contributor page if user is already a contributor" in new DisplayForm {
      val attributes = UserAttributes("123", ContentAccess(recurringContributor = true))
      val result = fakeRequestMaybeAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> attributes.asRight)
      )
      status(result) mustBe 303
      header("Location", result) mustBe Some("/contribute/recurring/existing")
    }

    "return form if user is not in members api" in new DisplayForm {
      val result = fakeRequestMaybeAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> (UserNotFound: MembersDataServiceError).asLeft)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }

    "return form if members api fails" in new DisplayForm {
      val result = fakeRequestMaybeAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> (UnexpectedResponseStatus(100): MembersDataServiceError).asLeft)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }

    "return form if user is not a recurring contributor" in new DisplayForm {
      val attributes = UserAttributes("123", ContentAccess(recurringContributor = false))
      val result = fakeRequestMaybeAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> attributes.asRight)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }
  }

  "GET /contribute/recurring-guest when not signed in" should {

    "return form is user is not signed in" in new DisplayForm {
      val result = fakeRequestMaybeAuthenticatedWith(actionRefiner = loggedOutActionRefiner)
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }
  }
}
