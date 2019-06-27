package controllers

import org.scalatest.WordSpec
import org.scalatest.MustMatchers
import fixtures.TestCSRFComponents
import actions.CustomActionBuilders
import play.api.test.FakeRequest
import play.api.test.Helpers.{status, stubControllerComponents}
import akka.util.Timeout
import org.scalatest.mockito.MockitoSugar.mock
import com.gu.identity.play.AuthenticatedIdUser
import config.Configuration.IdentityUrl
import services.{AuthenticationService, TestUserService}

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

class SiteMapTest extends WordSpec with MustMatchers with TestCSRFComponents {

  implicit val timeout = Timeout(2.seconds)

  val actionRefiner = new CustomActionBuilders(
    authenticationService = mock[AuthenticationService],
    idWebAppUrl = IdentityUrl(""),
    supportUrl = "",
    cc = stubControllerComponents(),
    addToken = csrfAddToken,
    checkToken = csrfCheck,
    csrfConfig = csrfConfig
  )

  "GET /sitemap.xml" should {
    "not return an error" in {
      val result = new SiteMap(
        actionRefiner, stubControllerComponents()
      )(mock[ExecutionContext]).sitemap.apply(FakeRequest())
      status(result) mustBe 200
    }
  }

}
