package controllers

import actions.{CustomActionBuilders, UserFromAuthCookiesActionBuilder}
import admin.settings.{AllSettingsProvider, FeatureSwitches, On}
import akka.util.Timeout
import assets.AssetsResolver
import com.gu.support.config._
import config.{RecaptchaConfigProvider, StringsConfig}
import fixtures.TestCSRFComponents
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar.mock
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, header, stubControllerComponents}
import services._

import scala.concurrent.ExecutionContext
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class ApplicationTest extends AnyWordSpec with Matchers with TestCSRFComponents {

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

  "/healthcheck" should {
    "return healthy" in {
      val result = new Application(
        actionRefiner,
        mock[AssetsResolver],
        mock[TestUserService],
        stubControllerComponents(),
        mock[StripeConfigProvider],
        mock[StripeConfigProvider],
        mock[PayPalConfigProvider],
        mock[AmazonPayConfigProvider],
        mock[RecaptchaConfigProvider],
        mock[PaymentAPIService],
        "",
        mock[StringsConfig],
        mock[AllSettingsProvider],
        mock[Stage],
        "support.thegulocal.com",
      )(mock[ExecutionContext]).healthcheck.apply(FakeRequest())
      contentAsString(result) mustBe "healthy"
    }

    "not be cached" in {
      val result = new Application(
        actionRefiner,
        mock[AssetsResolver],
        mock[TestUserService],
        stubControllerComponents(),
        mock[StripeConfigProvider],
        mock[StripeConfigProvider],
        mock[PayPalConfigProvider],
        mock[AmazonPayConfigProvider],
        mock[RecaptchaConfigProvider],
        mock[PaymentAPIService],
        "",
        mock[StringsConfig],
        mock[AllSettingsProvider],
        mock[Stage],
        "support.thegulocal.com",
      )(mock[ExecutionContext]).healthcheck.apply(FakeRequest())
      header("Cache-Control", result) mustBe Some("no-cache, private")
    }
  }
}
