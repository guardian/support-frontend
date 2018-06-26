package controllers

import org.scalatest.WordSpec
import org.scalatest.MustMatchers
import fixtures.TestCSRFComponents
import actions.CustomActionBuilders
import play.api.test.FakeRequest
import play.api.test.Helpers.{stubControllerComponents, status}
import akka.util.Timeout
import org.scalatest.mockito.MockitoSugar.mock
import com.gu.identity.play.AuthenticatedIdUser
import services.TestUserService

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

class SiteMapTest extends WordSpec with MustMatchers with TestCSRFComponents {

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

  "GET /sitemap.xml" should {
    "not return an error" in {
      val result = new SiteMap(
        actionRefiner, stubControllerComponents()
      )(mock[ExecutionContext]).sitemap.apply(FakeRequest())
      status(result) mustBe 200
    }
  }

}
