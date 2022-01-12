package actions

import com.gu.identity.model.User
import com.gu.support.config.{Stage, Stages}
import config.Configuration.IdentityUrl
import fixtures.TestCSRFComponents
import org.mockito.ArgumentMatchers._
import org.mockito.Mockito._
import org.scalatestplus.mockito.MockitoSugar
import play.api.http.Status
import play.api.mvc.Results._
import play.api.test.FakeRequest
import play.api.test.Helpers._
import services._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.must.Matchers

class ActionRefinerTest extends AnyWordSpec with Matchers with TestCSRFComponents with MockitoSugar {

  val path = "/test-path"
  val fakeRequest = FakeRequest("GET", path)
  val stage = Stages.DEV

  trait Mocks {
    val asyncAuthenticationService = mock[AsyncAuthenticationService]
  }

  "PrivateAction" should {

    "include Cache-control: no-cache, private" in new Mocks {
      val actionRefiner =
        new CustomActionBuilders(asyncAuthenticationService, stubControllerComponents(), csrfAddToken, csrfCheck, csrfConfig, stage)
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
        asyncAuthenticationService, stubControllerComponents(), csrfAddToken, csrfCheck, csrfConfig, stage
      )

      val result = actionRefiner.maybeAuthenticatedAction()(_.user match {
        case Some(user) if (user == passedInUser) => Ok("authentication-test")
        case u => InternalServerError(s"didn't get (right) user $u")
      }).apply(fakeRequest)

      status(result) mustEqual Status.OK
      contentAsString(result) mustEqual "authentication-test"
    }

    "don't pass in a user if they does not authenticate" in new Mocks {
      val path = "/test-path"
      when(asyncAuthenticationService.tryAuthenticateUser(any())).thenReturn(Future.successful(None))
      val actionRefiner = new CustomActionBuilders(
        asyncAuthenticationService,
        cc = stubControllerComponents(),
        addToken = csrfAddToken,
        checkToken = csrfCheck,
        csrfConfig = csrfConfig,
        stage = stage
      )

      val result = actionRefiner.maybeAuthenticatedAction()(_.user match {
        case Some(user) => InternalServerError("got a user")
        case None => Ok("no-user")
      }).apply(fakeRequest)

      status(result) mustEqual Status.OK
      contentAsString(result) mustEqual "no-user"
    }

    "return a private cache header if user is authenticated" in new Mocks {
      when(asyncAuthenticationService.tryAuthenticateUser(any()))
        .thenReturn(Future.successful(Some(mock[User])))
      val actionRefiner = new CustomActionBuilders(
        asyncAuthenticationService,
        cc = stubControllerComponents(),
        addToken = csrfAddToken,
        checkToken = csrfCheck,
        csrfConfig = csrfConfig,
        stage = stage
      )
      val result = actionRefiner.maybeAuthenticatedAction()(Ok("authentication-test")).apply(fakeRequest)
      header("Cache-Control", result) mustBe Some("no-cache, private")
    }

    "return a private cache header if user is not authenticated" in new Mocks {
      when(asyncAuthenticationService.tryAuthenticateUser(any())).thenReturn(Future.successful(None))
      val actionRefiner = new CustomActionBuilders(
        asyncAuthenticationService,
        cc = stubControllerComponents(),
        addToken = csrfAddToken,
        checkToken = csrfCheck,
        csrfConfig = csrfConfig,
        stage = stage
      )
      val result = actionRefiner.maybeAuthenticatedAction()(Ok("authentication-test")).apply(fakeRequest)
      header("Cache-Control", result) mustBe Some("no-cache, private")
    }

  }
}
