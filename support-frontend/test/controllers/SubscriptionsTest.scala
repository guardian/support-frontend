package controllers

import actions.CustomActionBuilders
import admin.settings._
import com.gu.i18n.CountryGroup
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{NoFulfilmentOptions, NoProductOptions}
import com.gu.support.config.Stages.PROD
import com.gu.support.config._
import services.pricing.{PriceSummary, PriceSummaryService, PriceSummaryServiceProvider, ProductPrices}
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.{Monthly, StripePublicKey, StripeSecretKey}
import com.gu.support.zuora.api.ReaderType
import com.typesafe.config.ConfigFactory
import config.Configuration.MetricUrl
import config.{RecaptchaConfig, RecaptchaConfigProvider}
import fixtures.TestCSRFComponents
import io.circe.JsonObject
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar.mock
import play.api.mvc.Result
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, status, stubControllerComponents, _}
import services.{CachedProductCatalogService, CachedProductCatalogServiceProvider, TestUserService}

import scala.concurrent.Future

class SubscriptionsTest extends AnyWordSpec with Matchers with TestCSRFComponents {

  val appConf = ConfigFactory.load("DEV.public.conf")

  trait DigitalSubscriptionsDisplayForm extends DisplayFormMocks {

    import scala.concurrent.ExecutionContext.Implicits.global

    val amount = 25
    val selection = AmountsSelection(
      amounts = List(amount),
      defaultAmount = 25,
      hideChooseYourAmount = Option(false),
    )
    val amountsCardData = ContributionAmounts(
      ONE_OFF = selection,
      MONTHLY = selection,
      ANNUAL = selection,
    )

    val amountsVariant = AmountsVariant(
      variantName = "subscriptions-test-variant",
      defaultContributionType = "MONTHLY",
      displayContributionType = List("ONE_OFF", "MONTHLY", "ANNUAL"),
      amountsCardData = amountsCardData,
    )

    val amountsTest = AmountsTest(
      testName = "subscriptions-default-test",
      liveTestName = Option("subscriptions-AB-test"),
      testLabel = Option("Subscription AB Test"),
      isLive = false,
      targeting = AmountsTestTargeting.Region(region = "GBPCountries"),
      order = 0,
      seed = 0,
      variants = List(amountsVariant),
    )

    val amountsTests = List(amountsTest)

    val contributionTypesSettings = List(
      ContributionTypeSetting(
        contributionType = ONE_OFF,
        isDefault = Some(true),
      ),
    )
    val contributionTypes = ContributionTypes(
      GBPCountries = contributionTypesSettings,
      UnitedStates = contributionTypesSettings,
      EURCountries = contributionTypesSettings,
      AUDCountries = contributionTypesSettings,
      International = contributionTypesSettings,
      NZDCountries = contributionTypesSettings,
      Canada = contributionTypesSettings,
    )

    val allSettings = AllSettings(
      Switches(
        oneOffPaymentMethods = OneOffPaymentMethodSwitches(Some(On), Some(On), Some(On)),
        recurringPaymentMethods = RecurringPaymentMethodSwitches(
          stripe = Some(On),
          stripeApplePay = Some(On),
          stripePaymentRequestButton = Some(On),
          stripeExpressCheckout = Some(On),
          payPal = Some(On),
          directDebit = Some(Off),
          sepa = Some(Off),
          stripeHostedCheckout = Some(Off),
        ),
        subscriptionsPaymentMethods = SubscriptionsPaymentMethodSwitches(Some(On), Some(On), Some(On), Some(Off)),
        subscriptionsSwitches = SubscriptionsSwitches(Some(On), Some(On)),
        featureSwitches = FeatureSwitches(Some(On), Some(On), Some(Off), Some(On), Some(On)),
        campaignSwitches = CampaignSwitches(Some(On), Some(On)),
        recaptchaSwitches = RecaptchaSwitches(Some(On), Some(On)),
      ),
      amountsTests,
      ContributionTypes(Nil, Nil, Nil, Nil, Nil, Nil, Nil),
      MetricUrl("http://localhost"),
      Nil,
    )

    def fakeDigitalPack(
        actionRefiner: CustomActionBuilders = loggedInActionRefiner,
    ): DigitalSubscriptionFormController = {
      val settingsProvider = mock[AllSettingsProvider]
      when(settingsProvider.getAllSettings()).thenReturn(allSettings)
      val testUserService = mock[TestUserService]
      val stripe = mock[StripePublicConfigProvider]
      val stripeAccountConfig = StripePublicKey.get("pk_test_asdf")
      when(stripe.get(any[Boolean]))
        .thenReturn(
          StripePublicConfig(stripeAccountConfig, stripeAccountConfig, stripeAccountConfig, stripeAccountConfig),
        )
      val payPal = mock[PayPalConfigProvider]
      when(payPal.get(any[Boolean])).thenReturn(PayPalConfig("", "", "", "", "", ""))
      val recaptchaConfigProvider = mock[RecaptchaConfigProvider]
      when(recaptchaConfigProvider.get(any[Boolean])).thenReturn(RecaptchaConfig("", ""))

      val prices: ProductPrices = Map(
        CountryGroup.UK ->
          Map(
            NoFulfilmentOptions ->
              Map(
                NoProductOptions ->
                  Map(
                    Monthly ->
                      Map(GBP -> PriceSummary(10, None, GBP, fixedTerm = false, Nil)),
                  ),
              ),
          ),
      )
      val priceSummaryServiceProvider = mock[PriceSummaryServiceProvider]
      val priceSummaryService = mock[PriceSummaryService]
      val productCatalog = mock[CachedProductCatalogServiceProvider]
      val cachedProductCatalogService = mock[CachedProductCatalogService]

      when(cachedProductCatalogService.get()).thenReturn(JsonObject())
      when(productCatalog.fromStage(PROD, false)).thenReturn(cachedProductCatalogService)
      when(priceSummaryService.getPrices(any[com.gu.support.catalog.Product], any[List[PromoCode]], any[ReaderType]))
        .thenReturn(prices)
      when(priceSummaryServiceProvider.forUser(any[Boolean])).thenReturn(priceSummaryService)

      new DigitalSubscriptionFormController(
        priceSummaryServiceProvider = priceSummaryServiceProvider,
        assets = assetResolver,
        actionRefiners = actionRefiner,
        testUsers = testUserService,
        stripeConfigProvider = stripe,
        payPalConfigProvider = payPal,
        components = stubControllerComponents(),
        settingsProvider = settingsProvider,
        recaptchaConfigProvider,
        productCatalog,
        PROD,
      )
    }

    def fakeRequestAuthenticatedWith(
        actionRefiner: CustomActionBuilders = loggedInActionRefiner,
    ): Future[Result] = {
      fakeDigitalPack(actionRefiner).displayForm()(FakeRequest())
    }
  }

  "GET subscribe/digital/checkout" should {

    "return form if user is signed in" in new DigitalSubscriptionsDisplayForm {
      when(asyncAuthenticationService.tryAuthenticateUser(any()))
        .thenReturn(Future.successful(Some(authenticatedIdUser)))

      val result = fakeRequestAuthenticatedWith(actionRefiner = loggedInActionRefiner)

      status(result) mustBe 200
      contentAsString(result) must include("digitalSubscriptionCheckoutPage.js")
    }
  }
}
