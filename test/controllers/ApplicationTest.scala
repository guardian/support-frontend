package controllers

import actions.CustomActionBuilders
import org.scalatest.WordSpec
import org.scalatest.MustMatchers
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, header, stubControllerComponents}
import akka.util.Timeout
import assets.AssetsResolver
import com.gu.identity.play.AuthenticatedIdUser
import fixtures.TestCSRFComponents
import org.scalatest.mockito.MockitoSugar.mock
import services.{IdentityService, TestUserService}

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

class ApplicationTest extends WordSpec with MustMatchers with TestCSRFComponents {

  implicit val timeout = Timeout(2.seconds)

  val actionRefiner = new CustomActionBuilders(
    authenticatedIdUserProvider = _ => Some(mock[AuthenticatedIdUser]),
    idWebAppUrl = "",
    supportUrl = "",
    testUsers = mock[TestUserService],
    cc = stubControllerComponents(),
    addToken = csrfAddToken,
    checkToken = csrfCheck,
    csrfConfig = csrfConfig
  )

  val contributionsPayPalEndpoint = ""

  "/healthcheck" should {
    "return healthy" in {
      val result = new Application(
        actionRefiner, mock[AssetsResolver], mock[IdentityService], stubControllerComponents(), contributionsPayPalEndpoint
      )(mock[ExecutionContext]).healthcheck.apply(FakeRequest())
      contentAsString(result) mustBe "healthy"
    }

    "not be cached" in {
      val result = new Application(
        actionRefiner, mock[AssetsResolver], mock[IdentityService], stubControllerComponents(), contributionsPayPalEndpoint
      )(mock[ExecutionContext]).healthcheck.apply(FakeRequest())
      header("Cache-Control", result) mustBe Some("no-cache, private")
    }
  }
}
