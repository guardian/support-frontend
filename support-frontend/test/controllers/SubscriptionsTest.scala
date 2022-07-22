package controllers

import actions.CustomActionBuilders
import admin.settings._
import com.gu.i18n.CountryGroup
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{NoFulfilmentOptions, NoProductOptions}
import com.gu.support.config._
import services.pricing.{PriceSummary, PriceSummaryService, PriceSummaryServiceProvider, ProductPrices}
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.Monthly
import com.gu.support.zuora.api.ReaderType
import com.typesafe.config.ConfigFactory
import config.Configuration.MetricUrl
import config.{RecaptchaConfig, RecaptchaConfigProvider}
import fixtures.TestCSRFComponents
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar.mock
import play.api.mvc.Result
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, status, stubControllerComponents, _}
import services.TestUserService

import scala.concurrent.Future

class SubscriptionsTest extends AnyWordSpec with Matchers with TestCSRFComponents {

  val appConf = ConfigFactory.load("DEV.public.conf")

  trait DigitalSubscriptionsDisplayForm extends DisplayFormMocks {

    import scala.concurrent.ExecutionContext.Implicits.global

    val amount = 25
    val selection = AmountsSelection(amounts = List(amount), defaultAmount = 25)
    val contributionAmounts = ContributionAmounts(
      ONE_OFF = selection,
      MONTHLY = selection,
      ANNUAL = selection,
    )
    val configuredRegionAmounts = ConfiguredRegionAmounts(
      control = contributionAmounts,
      test = None,
    )
    val configuredAmounts = ConfiguredAmounts(
      GBPCountries = configuredRegionAmounts,
      UnitedStates = configuredRegionAmounts,
      EURCountries = configuredRegionAmounts,
      AUDCountries = configuredRegionAmounts,
      International = configuredRegionAmounts,
      NZDCountries = configuredRegionAmounts,
      Canada = configuredRegionAmounts,
    )

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
        oneOffPaymentMethods = OneOffPaymentMethodSwitches(On, On, On, On, On),
        recurringPaymentMethods = RecurringPaymentMethodSwitches(On, On, On, On, Off, On, On, On, Off),
        subscriptionsPaymentMethods = SubscriptionsPaymentMethodSwitches(On),
        subscriptionsSwitches = SubscriptionsSwitches(On, On, On),
        featureSwitches = FeatureSwitches(On, On),
        campaignSwitches = CampaignSwitches(On, On),
        recaptchaSwitches = RecaptchaSwitches(On, On),
      ),
      configuredAmounts,
      ContributionTypes(Nil, Nil, Nil, Nil, Nil, Nil, Nil),
      MetricUrl("http://localhost"),
    )

    def fakeDigitalPack(
        actionRefiner: CustomActionBuilders = loggedInActionRefiner,
    ): DigitalSubscriptionFormController = {
      val settingsProvider = mock[AllSettingsProvider]
      when(settingsProvider.getAllSettings()).thenReturn(allSettings)
      val testUserService = mock[TestUserService]
      val stripe = mock[StripeConfigProvider]
      val stripeAccountConfig = StripeAccountConfig("", "")
      when(stripe.get(any[Boolean]))
        .thenReturn(StripeConfig(stripeAccountConfig, stripeAccountConfig, stripeAccountConfig, None))
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
      )
    }

    def fakeRequestAuthenticatedWith(
        actionRefiner: CustomActionBuilders = loggedInActionRefiner,
    ): Future[Result] = {
      fakeDigitalPack(actionRefiner).displayForm(false)(FakeRequest())
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
