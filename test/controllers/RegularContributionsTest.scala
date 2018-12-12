package controllers

import actions.CustomActionBuilders

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import cats.implicits._
import org.scalatest.mockito.MockitoSugar._
import org.scalatest.{MustMatchers, WordSpec}
import org.scalatest.OptionValues._
import org.mockito.Mockito.when
import org.mockito.ArgumentMatchers.any
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.mvc.Result
import services.stepfunctions.RegularContributionsClient
import services.{HttpIdentityService, MembersDataService}
import services.MembersDataService._
import com.gu.support.config._
import admin.SwitchState.On
import admin.{PaymentMethodsSwitch, Settings, SettingsProvider, Switches}
import com.gu.tip.Tip
import config.Configuration.GuardianDomain

class RegularContributionsTest extends WordSpec with MustMatchers {

  trait RegularContributionsDisplayForm extends DisplayFormMocks {
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

      val settingsProvider = mock[SettingsProvider]
      when(settingsProvider.settings()).thenReturn(
        Settings(Switches(PaymentMethodsSwitch(On, On, None), PaymentMethodsSwitch(On, On, Some(On)), Map.empty, On))
      )

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
        guardianDomain = GuardianDomain(".thegulocal.com"),
        settingsProvider,
        mock[Tip]
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

    "redirect unauthenticated user to signup page" in new RegularContributionsDisplayForm {
      val result = fakeRequestAuthenticatedWith(actionRefiner = loggedOutActionRefiner)
      status(result) mustBe 303
      header("Location", result).value must startWith("https://identity-url.local")
    }

    "return internal server error if identity does not return user info" in new RegularContributionsDisplayForm {
      val result = fakeRequestAuthenticatedWith(
        identityService = mockedIdentityService(authenticatedIdUser.user -> "not found".asLeft)
      )
      status(result) mustBe 500
    }

    "redirect to existing-contributor page if user is already a contributor" in new RegularContributionsDisplayForm {
      val attributes = UserAttributes("123", ContentAccess(recurringContributor = true))
      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> attributes.asRight)
      )
      status(result) mustBe 303
      header("Location", result) mustBe Some("/contribute/recurring/existing")
    }

    "return form if user is not in members api" in new RegularContributionsDisplayForm {
      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> (UserNotFound: MembersDataServiceError).asLeft)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }

    "return form if members api fails" in new RegularContributionsDisplayForm {
      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> (UnexpectedResponseStatus(100): MembersDataServiceError).asLeft)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }

    "return form if user is not a recurring contributor" in new RegularContributionsDisplayForm {
      val attributes = UserAttributes("123", ContentAccess(recurringContributor = false))
      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> attributes.asRight)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }
  }

  "GET /contribute/recurring-guest when signed in" should {

    "return internal server error if identity does not return user info" in new RegularContributionsDisplayForm {
      val result = fakeRequestMaybeAuthenticatedWith(
        identityService = mockedIdentityService(authenticatedIdUser.user -> "not found".asLeft)
      )
      status(result) mustBe 500
    }

    "redirect to existing-contributor page if user is already a contributor" in new RegularContributionsDisplayForm {
      val attributes = UserAttributes("123", ContentAccess(recurringContributor = true))
      val result = fakeRequestMaybeAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> attributes.asRight)
      )
      status(result) mustBe 303
      header("Location", result) mustBe Some("/contribute/recurring/existing")
    }

    "return form if user is not in members api" in new RegularContributionsDisplayForm {
      val result = fakeRequestMaybeAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> (UserNotFound: MembersDataServiceError).asLeft)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }

    "return form if members api fails" in new RegularContributionsDisplayForm {
      val result = fakeRequestMaybeAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> (UnexpectedResponseStatus(100): MembersDataServiceError).asLeft)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }

    "return form if user is not a recurring contributor" in new RegularContributionsDisplayForm {
      val attributes = UserAttributes("123", ContentAccess(recurringContributor = false))
      val result = fakeRequestMaybeAuthenticatedWith(
        membersDataService = mockedMembersDataService(credentials -> attributes.asRight)
      )
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }
  }

  "GET /contribute/recurring-guest when not signed in" should {

    "return form is user is not signed in" in new RegularContributionsDisplayForm {
      val result = fakeRequestMaybeAuthenticatedWith(actionRefiner = loggedOutActionRefiner)
      status(result) mustBe 200
      contentAsString(result) must include("regularContributionsPage.js")
    }
  }
}
