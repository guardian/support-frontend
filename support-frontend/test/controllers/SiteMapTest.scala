package controllers

import fixtures.TestCSRFComponents
import actions.CustomActionBuilders
import play.api.test.FakeRequest
import play.api.test.Helpers.{status, stubControllerComponents}
import akka.util.Timeout
import org.scalatestplus.mockito.MockitoSugar.mock
import config.Configuration.IdentityUrl
import services.AsyncAuthenticationService

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.must.Matchers

class SiteMapTest extends AnyWordSpec with Matchers with TestCSRFComponents {

  implicit val timeout = Timeout(2.seconds)

  val actionRefiner = new CustomActionBuilders(
    asyncAuthenticationService = mock[AsyncAuthenticationService],
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
