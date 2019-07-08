package controllers

import actions.CustomActionBuilders
import admin.settings.AllSettingsProvider
import org.scalatest.WordSpec
import org.scalatest.MustMatchers
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, header, stubControllerComponents}
import akka.util.Timeout
import assets.{AssetsResolver, RefPath, StyleContent}
import config.StringsConfig
import fixtures.TestCSRFComponents
import org.scalatest.mockito.MockitoSugar.mock
import services._
import com.gu.support.config.{PayPalConfigProvider, Stage, StripeConfigProvider}
import config.Configuration.{GuardianDomain, IdentityUrl}

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

class ApplicationTest extends WordSpec with MustMatchers with TestCSRFComponents {

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

  "/healthcheck" should {
    "return healthy" in {
      val result = new Application(
        actionRefiner,
        mock[AssetsResolver],
        mock[IdentityService],
        stubControllerComponents(),
        mock[StripeConfigProvider],
        mock[StripeConfigProvider],
        mock[PayPalConfigProvider],
        mock[PaymentAPIService],
        mock[MembersDataService],
        mock[StringsConfig],
        mock[AllSettingsProvider],
        mock[GuardianDomain],
        mock[Stage],
        "support.thegulocal.com",
        mock[Either[RefPath, StyleContent]]
      )(mock[ExecutionContext]).healthcheck.apply(FakeRequest())
      contentAsString(result) mustBe "healthy"
    }

    "not be cached" in {
      val result = new Application(
        actionRefiner,
        mock[AssetsResolver],
        mock[IdentityService],
        stubControllerComponents(),
        mock[StripeConfigProvider],
        mock[StripeConfigProvider],
        mock[PayPalConfigProvider],
        mock[PaymentAPIService],
        mock[MembersDataService],
        mock[StringsConfig],
        mock[AllSettingsProvider],
        mock[GuardianDomain],
        mock[Stage],
        "support.thegulocal.com",
        mock[Either[RefPath, StyleContent]]
      )(mock[ExecutionContext]).healthcheck.apply(FakeRequest())
      header("Cache-Control", result) mustBe Some("no-cache, private")
    }
  }
}
