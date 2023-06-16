package controllers

import actions.{CustomActionBuilders, UserFromAuthCookiesActionBuilder}
import admin.settings.{FeatureSwitches, On}
import akka.util.Timeout
import com.gu.support.config.Stages
import fixtures.TestCSRFComponents
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar.mock
import play.api.test.FakeRequest
import play.api.test.Helpers.{status, stubControllerComponents}
import services.AsyncAuthenticationService

import scala.concurrent.ExecutionContext
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class SiteMapTest extends AnyWordSpec with Matchers with TestCSRFComponents {

  implicit val timeout = Timeout(2.seconds)
  val stage = Stages.DEV

  val actionRefiner = new CustomActionBuilders(
    asyncAuthenticationService = mock[AsyncAuthenticationService],
    userFromAuthCookiesActionBuilder = mock[UserFromAuthCookiesActionBuilder],
    cc = stubControllerComponents(),
    addToken = csrfAddToken,
    checkToken = csrfCheck,
    csrfConfig = csrfConfig,
    stage = stage,
    featureSwitches = FeatureSwitches(On, On, On),
  )

  "GET /sitemap.xml" should {
    "not return an error" in {
      val result = new SiteMap(
        actionRefiner,
        stubControllerComponents(),
      )(mock[ExecutionContext]).sitemap.apply(FakeRequest())
      status(result) mustBe 200
    }
  }

}
