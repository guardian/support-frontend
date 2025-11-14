package actions

import admin.settings.{FeatureSwitches, Off, On}
import com.gu.identity.model.User
import com.gu.support.config.Stages
import fixtures.TestCSRFComponents
import org.mockito.ArgumentMatchers._
import org.mockito.Mockito._
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar
import play.api.http.Status
import play.api.mvc.Results._
import play.api.test.FakeRequest
import play.api.test.Helpers._
import services._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ActionRefinerTest extends AnyWordSpec with Matchers with TestCSRFComponents with MockitoSugar {

  val path = "/test-path"
  val fakeRequest = FakeRequest("GET", path)
  val stage = Stages.DEV
  val featureSwitches =
    FeatureSwitches(
      enableQuantumMetric = Some(On),
      usStripeAccountForSingle = Some(On),
      authenticateWithOkta = Some(Off),
      enableCampaignCountdown = Some(On),
      enableThankYouOnboarding = Some(On),
      enableCheckoutNudge = Some(On),
    )

  val testUsersService = TestUserService("secret")

  trait Mocks {
    val asyncAuthenticationService = mock[AsyncAuthenticationService]
    val userFromAuthCookiesOrAuthServerActionBuilder = mock[UserFromAuthCookiesOrAuthServerActionBuilder]
    val userFromAuthCookiesActionBuilder = mock[UserFromAuthCookiesActionBuilder]
  }

  "PrivateAction" should {

    "include Cache-control: no-cache, private" in new Mocks {
      val actionRefiner =
        new CustomActionBuilders(
          asyncAuthenticationService,
          userFromAuthCookiesOrAuthServerActionBuilder,
          userFromAuthCookiesActionBuilder,
          stubControllerComponents(),
          csrfAddToken,
          csrfCheck,
          csrfConfig,
          stage,
          featureSwitches = featureSwitches,
          testUsersService = testUsersService,
        )
      val result = actionRefiner.PrivateAction(Ok("")).apply(FakeRequest())
      header("Cache-Control", result) mustBe Some("no-cache, private")
    }

  }

  "AuthenticatedAction" should {

    "respond to request if provider authenticates user" in new Mocks {

      private val passedInUser: User = mock[User]
      when(asyncAuthenticationService.tryAuthenticateUser(any()))
        .thenReturn(Future.successful(Some(passedInUser)))

      val actionRefiner = new CustomActionBuilders(
        asyncAuthenticationService,
        userFromAuthCookiesOrAuthServerActionBuilder,
        userFromAuthCookiesActionBuilder,
        stubControllerComponents(),
        csrfAddToken,
        csrfCheck,
        csrfConfig,
        stage,
        featureSwitches = featureSwitches,
        testUsersService = testUsersService,
      )

      val result = actionRefiner
        .MaybeAuthenticatedAction(_.user match {
          case Some(user) if user == passedInUser => Ok("authentication-test")
          case u => InternalServerError(s"didn't get (right) user $u")
        })
        .apply(fakeRequest)

      status(result) mustEqual Status.OK
      contentAsString(result) mustEqual "authentication-test"
    }

    "don't pass in a user if they does not authenticate" in new Mocks {
      val path = "/test-path"
      when(asyncAuthenticationService.tryAuthenticateUser(any())).thenReturn(Future.successful(None))
      val actionRefiner = new CustomActionBuilders(
        asyncAuthenticationService,
        userFromAuthCookiesOrAuthServerActionBuilder,
        userFromAuthCookiesActionBuilder,
        cc = stubControllerComponents(),
        addToken = csrfAddToken,
        checkToken = csrfCheck,
        csrfConfig = csrfConfig,
        stage = stage,
        featureSwitches = featureSwitches,
        testUsersService = testUsersService,
      )

      val result = actionRefiner
        .MaybeAuthenticatedAction(_.user match {
          case Some(user) => InternalServerError("got a user")
          case None => Ok("no-user")
        })
        .apply(fakeRequest)

      status(result) mustEqual Status.OK
      contentAsString(result) mustEqual "no-user"
    }

    "return a private cache header if user is authenticated" in new Mocks {
      when(asyncAuthenticationService.tryAuthenticateUser(any()))
        .thenReturn(Future.successful(Some(mock[User])))
      val actionRefiner = new CustomActionBuilders(
        asyncAuthenticationService,
        userFromAuthCookiesOrAuthServerActionBuilder,
        userFromAuthCookiesActionBuilder,
        cc = stubControllerComponents(),
        addToken = csrfAddToken,
        checkToken = csrfCheck,
        csrfConfig = csrfConfig,
        stage = stage,
        featureSwitches = featureSwitches,
        testUsersService = testUsersService,
      )
      val result = actionRefiner.MaybeAuthenticatedAction(Ok("authentication-test")).apply(fakeRequest)
      header("Cache-Control", result) mustBe Some("no-cache, private")
    }

    "return a private cache header if user is not authenticated" in new Mocks {
      when(asyncAuthenticationService.tryAuthenticateUser(any())).thenReturn(Future.successful(None))
      val actionRefiner = new CustomActionBuilders(
        asyncAuthenticationService,
        userFromAuthCookiesOrAuthServerActionBuilder,
        userFromAuthCookiesActionBuilder,
        cc = stubControllerComponents(),
        addToken = csrfAddToken,
        checkToken = csrfCheck,
        csrfConfig = csrfConfig,
        stage = stage,
        featureSwitches = featureSwitches,
        testUsersService = testUsersService,
      )
      val result = actionRefiner.MaybeAuthenticatedAction(Ok("authentication-test")).apply(fakeRequest)
      header("Cache-Control", result) mustBe Some("no-cache, private")
    }

  }
}
