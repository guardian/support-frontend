package controllers

import actions.CustomActionBuilders
import admin.SwitchState.On
import admin.{AllSettings, AllSettingsProvider, PaymentMethodsSwitch, Switches}
import cats.implicits._
import com.gu.i18n.CountryGroup
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{NoFulfilmentOptions, NoProductOptions}
import com.gu.support.config._
import com.gu.support.pricing.{PriceSummary, PriceSummaryService, PriceSummaryServiceProvider, ProductPrices}
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.Monthly
import com.gu.tip.Tip
import config.Configuration.GuardianDomain
import config.StringsConfig
import fixtures.TestCSRFComponents
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
import org.scalatest.OptionValues._
import org.scalatest.mockito.MockitoSugar.mock
import org.scalatest.{MustMatchers, WordSpec}
import play.api.mvc.Result
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, status, stubControllerComponents, _}
import services.stepfunctions.SupportWorkersClient
import services.{HttpIdentityService, TestUserService}

import scala.concurrent.Future

class SubscriptionsTest extends WordSpec with MustMatchers with TestCSRFComponents {
  trait DigitalSubscriptionsDisplayForm extends DisplayFormMocks {
    import scala.concurrent.ExecutionContext.Implicits.global

    val checkoutEndpoint = "subscribe/digital/checkout?displayCheckout=true"

    def fakeDigitalPack(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: HttpIdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String])
    ): DigitalSubscription = {

      val settingsProvider = mock[AllSettingsProvider]
      when(settingsProvider.getAllSettings()).thenReturn(
        AllSettings(Switches(PaymentMethodsSwitch(On, On, None), PaymentMethodsSwitch(On, On, Some(On)), Map.empty, On))
      )

      val client = mock[SupportWorkersClient]
      val testUserService = mock[TestUserService]
      val tip = mock[Tip]
      val stripe = mock[StripeConfigProvider]
      val stripeAccountConfig = StripeAccountConfig("", "")
      when(stripe.get(any[Boolean])).thenReturn(
        StripeConfig(stripeAccountConfig, stripeAccountConfig, None)
      )
      val payPal = mock[PayPalConfigProvider]
      when(payPal.get(any[Boolean])).thenReturn(PayPalConfig("", "", "", "", "", ""))

      val prices: ProductPrices = Map(
        CountryGroup.UK ->
          Map(NoFulfilmentOptions ->
            Map(NoProductOptions ->
              Map(Monthly ->
                Map(GBP -> PriceSummary(10, None))))))
      val priceSummaryServiceProvider = mock[PriceSummaryServiceProvider]
      val priceSummaryService = mock[PriceSummaryService]
      when(priceSummaryService.getPrices(any[com.gu.support.catalog.Product], any[Option[PromoCode]])).thenReturn(prices)
      when(priceSummaryServiceProvider.forUser(any[Boolean])).thenReturn(priceSummaryService)

      new DigitalSubscription(
        priceSummaryServiceProvider,
        client,
        assetResolver,
        actionRefiner,
        identityService,
        testUserService,
        stripe,
        payPal,
        stubControllerComponents(),
        new StringsConfig(),
        settingsProvider,
        "support.thegulocal.com",
        tip,
        GuardianDomain(".thegulocal.com")
      )
    }

    def fakeRequestAuthenticatedWith(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: HttpIdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String])
    ): Future[Result] = {
      fakeDigitalPack(actionRefiner, identityService).displayForm("UK")(FakeRequest())
    }
  }

  "GET subscribe/digital/checkout?displayCheckout=true" should {

    "redirect unauthenticated user to signup page" in new DigitalSubscriptionsDisplayForm {
      val result = fakeRequestAuthenticatedWith(actionRefiner = loggedOutActionRefiner)
      status(result) mustBe 303
      header("Location", result).value must startWith("https://identity-url.local")
    }

    "return a 500 if the call to get additional data from identity fails" in new DigitalSubscriptionsDisplayForm {
      val result = fakeRequestAuthenticatedWith(
        identityService = mockedIdentityService(authenticatedIdUser.user -> "not found".asLeft)
      )
      status(result) mustBe 500
    }

    "return form if user is signed in and call to identity is successful" in new DigitalSubscriptionsDisplayForm {
      val result = fakeRequestAuthenticatedWith(actionRefiner = loggedInActionRefiner)

      status(result) mustBe 200
      contentAsString(result) must include("digitalSubscriptionCheckoutPage.js")
    }

  }

}
