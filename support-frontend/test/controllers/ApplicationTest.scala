package controllers

import actions.{CustomActionBuilders, UserFromAuthCookiesActionBuilder, UserFromAuthCookiesOrAuthServerActionBuilder}
import admin.settings.{AllSettingsProvider, FeatureSwitches, On}
import org.apache.pekko.util.Timeout
import assets.AssetsResolver
import com.gu.i18n.CountryGroup
import com.gu.support.catalog.SupporterPlus
import com.gu.support.config._
import com.gu.support.promotions.PromoCode
import com.gu.support.zuora.api.ReaderType
import config.{RecaptchaConfigProvider, StringsConfig}
import fixtures.TestCSRFComponents
import org.mockito.ArgumentMatchers.{any, anyBoolean, anyList}
import org.mockito.Mockito.when
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar._
import play.api.libs.ws.WSClient
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, header, stubControllerComponents}
import services._
import services.pricing.{CountryGroupPrices, PriceSummaryService, PriceSummaryServiceProvider}

import scala.concurrent.ExecutionContext
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class ApplicationTest extends AnyWordSpec with Matchers with TestCSRFComponents {

  implicit val timeout = Timeout(2.seconds)
  val stage = Stages.DEV

  val actionRefiner = new CustomActionBuilders(
    asyncAuthenticationService = mock[AsyncAuthenticationService],
    userFromAuthCookiesOrAuthServerActionBuilder = mock[UserFromAuthCookiesOrAuthServerActionBuilder],
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
      val priceSummaryServiceProvider = {
        val priceSummaryService = mock[PriceSummaryService]
        when(
          priceSummaryService
            .getPrices[SupporterPlus.type](any[SupporterPlus.type], any[List[PromoCode]], any[ReaderType]),
        )
          .thenReturn(Map[CountryGroup, CountryGroupPrices](CountryGroup.UK -> Map.empty))
        val priceSummaryServiceProvider = mock[PriceSummaryServiceProvider]
        when(priceSummaryServiceProvider.forUser(anyBoolean())).thenReturn(priceSummaryService)
        priceSummaryServiceProvider
      }
      val result = new Application(
        actionRefiner,
        mock[AssetsResolver],
        mock[TestUserService],
        stubControllerComponents(),
        mock[StripePublicConfigProvider],
        mock[StripePublicConfigProvider],
        mock[PayPalConfigProvider],
        mock[AmazonPayConfigProvider],
        mock[RecaptchaConfigProvider],
        mock[PaymentAPIService],
        "",
        mock[StringsConfig],
        mock[AllSettingsProvider],
        mock[Stage],
        mock[WSClient],
        priceSummaryServiceProvider,
        "support.thegulocal.com",
      )(mock[ExecutionContext]).healthcheck.apply(FakeRequest())
      contentAsString(result) mustBe "healthy"
      header("Cache-Control", result) mustBe Some("no-cache, private")
    }

  }
}
