package controllers

import actions.UserFromAuthCookiesActionBuilder.UserClaims
import actions.{CustomActionBuilders, UserFromAuthCookiesActionBuilder, UserFromAuthCookiesOrAuthServerActionBuilder}
import admin.settings.{AllSettingsProvider, FeatureSwitches, On}
import org.apache.pekko.util.Timeout
import assets.AssetsResolver
import com.gu.i18n.CountryGroup
import com.gu.identity.auth.{DefaultAccessClaims, OktaAuthService}
import com.gu.support.catalog.SupporterPlus
import com.gu.support.config._
import com.gu.support.promotions.PromoCode
import com.gu.support.zuora.api.ReaderType
import config.{Identity, RecaptchaConfigProvider, StringsConfig}
import fixtures.TestCSRFComponents
import io.circe.JsonObject
import org.mockito.ArgumentMatchers.{any, anyBoolean}
import org.mockito.Mockito.when
import org.scalatest.EitherValues
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar._
import play.api.mvc.{AnyContent, BodyParser}
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, header, status, stubControllerComponents}
import services._
import services.mparticle.MParticleClient
import services.pricing.{CountryGroupPrices, PriceSummaryService, PriceSummaryServiceProvider}

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class ApplicationTest extends AnyWordSpec with Matchers with TestCSRFComponents with EitherValues {

  implicit val timeout: Timeout = Timeout(2.seconds)
  val stage = Stages.DEV

  val parser = mock[BodyParser[AnyContent]]
  val authService = mock[OktaAuthService[DefaultAccessClaims, UserClaims]]
  val config = mock[Identity]
  val mockAuthActionBuilder = new UserFromAuthCookiesOrAuthServerActionBuilder(
    parser,
    authService,
    config,
    isAuthServerUp = () => Future.successful(true),
  )
  val actionRefiner = new CustomActionBuilders(
    asyncAuthenticationService = mock[AsyncAuthenticationService],
    userFromAuthCookiesOrAuthServerActionBuilder = mockAuthActionBuilder,
    userFromAuthCookiesActionBuilder = mock[UserFromAuthCookiesActionBuilder],
    cc = stubControllerComponents(),
    addToken = csrfAddToken,
    checkToken = csrfCheck,
    csrfConfig = csrfConfig,
    stage = stage,
    featureSwitches = FeatureSwitches(Some(On), Some(On), Some(On), Some(On), Some(On), Some(On), Some(On)),
    testUsersService = TestUserService("secret"),
  )

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

  val cachedProductCatalogService = mock[CachedProductCatalogService]
  when(cachedProductCatalogService.get()).thenReturn(JsonObject())
  val productCatalog = mock[CachedProductCatalogServiceProvider]
  when(productCatalog.fromStage(any, any)).thenReturn(cachedProductCatalogService)

  val applicationMock = new Application(
    actionRefiner,
    mock[AssetsResolver],
    mock[TestUserService],
    stubControllerComponents(),
    mock[StripePublicConfigProvider],
    mock[StripePublicConfigProvider],
    mock[PayPalConfigProvider],
    mock[RecaptchaConfigProvider],
    mock[PaymentAPIService],
    "",
    mock[StringsConfig],
    mock[AllSettingsProvider],
    mock[Stage],
    priceSummaryServiceProvider,
    productCatalog,
    "support.thegulocal.com",
    mock[TickerService],
    mock[MParticleClient],
  )(mock[ExecutionContext])

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
      val result = applicationMock.healthcheck.apply(FakeRequest())
      contentAsString(result) mustBe "healthy"
      header("Cache-Control", result) mustBe Some("no-cache, private")
    }

  }

  val productCatalogJson = io.circe.parser
    .parse("""
  {
    "SupporterPlus": {
			"ratePlans": {
				"Annual": {
					"id": "???",
					"billingPeriod": "Annual",
					"pricing": {
						"GBP": 120,
						"USD": 150
					},
					"charges": {
						"Subscription": { "id": "???" }
					}
				},
				"Monthly": {
					"id": "???",
					"billingPeriod": "Month",
					"pricing": {
						"GBP": 12,
						"USD": 15
					},
					"charges": {
						"Subscription": { "id": "???" }
					}
				}
			}
		}
  }
  """)
    .value
    .asObject
    .get

  "getProductParamsFromContributionParams" should {
    "return return Contribution if selected-amount is < SupporterPlus.Monthly.GBP price" in {
      val (product, ratePlan, maybeContributionAmount) = applicationMock.getProductParamsFromContributionParams(
        "uk",
        productCatalogJson,
        Map(
          "selected-contribution-type" -> Seq("monthly"),
          "selected-amount" -> Seq("10"),
        ),
      )
      assert(product === "Contribution")
      assert(ratePlan === "Monthly")
      assert(maybeContributionAmount === Some(10))
    }
    "return return SupporterPlus if selected-amount is >= SupporterPlus.Monthly.GBP price" in {
      val (product, ratePlan, maybeContributionAmount) = applicationMock.getProductParamsFromContributionParams(
        "uk",
        productCatalogJson,
        Map(
          "selected-contribution-type" -> Seq("monthly"),
          "selected-amount" -> Seq("14"),
        ),
      )
      assert(product === "SupporterPlus")
      assert(ratePlan === "Monthly")
      assert(maybeContributionAmount === None)
    }
    "return return SupporterPlus if selected-amount is >= SupporterPlus.Annual.GBP price" in {
      val (product, ratePlan, maybeContributionAmount) = applicationMock.getProductParamsFromContributionParams(
        "uk",
        productCatalogJson,
        Map(
          "selected-contribution-type" -> Seq("annual"),
          "selected-amount" -> Seq("140"),
        ),
      )
      assert(product === "SupporterPlus")
      assert(ratePlan === "Annual")
      assert(maybeContributionAmount === None)
    }
    "return return Contribution if selected-amount is < SupporterPlus.Annual.USD price" in {
      val (product, ratePlan, maybeContributionAmount) = applicationMock.getProductParamsFromContributionParams(
        "us",
        productCatalogJson,
        Map(
          "selected-contribution-type" -> Seq("annual"),
          "selected-amount" -> Seq("110"),
        ),
      )
      assert(product === "Contribution")
      assert(ratePlan === "Annual")
      assert(maybeContributionAmount === Some(110))
    }
    "return return SupporterPlus if selected-amount is >= SupporterPlus.Annual.USD price" in {
      val (product, ratePlan, maybeContributionAmount) = applicationMock.getProductParamsFromContributionParams(
        "us",
        productCatalogJson,
        Map(
          "selected-contribution-type" -> Seq("annual"),
          "selected-amount" -> Seq("150"),
        ),
      )
      assert(product === "SupporterPlus")
      assert(ratePlan === "Annual")
      assert(maybeContributionAmount === None)
    }
  }
}
