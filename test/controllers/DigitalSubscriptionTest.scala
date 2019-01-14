package controllers

import actions.CustomActionBuilders
import admin.SwitchState.On
import admin.{PaymentMethodsSwitch, Settings, SettingsProvider, Switches}
import cats.implicits._
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.support.config._
import com.gu.support.workers._
import com.gu.tip.Tip
import config.Configuration.GuardianDomain
import config.StringsConfig
import fixtures.TestCSRFComponents
import ophan.thrift.event.AbTest
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
import org.scalatest.OptionValues._
import org.scalatest.mockito.MockitoSugar.mock
import org.scalatest.{MustMatchers, WordSpec}
import play.api.mvc.Result
import play.api.test.{FakeHeaders, FakeRequest}
import play.api.test.Helpers.{contentAsString, status, stubControllerComponents, _}
import services.stepfunctions.{CreateSupportWorkersRequest, SupportWorkersClient}
import services.{HttpIdentityService, TestUserService}

import scala.concurrent.Future

class DigitalSubscriptionTest extends WordSpec with MustMatchers with TestCSRFComponents {
  trait DigitalSubscriptionsMocks extends DisplayFormMocks {
    import scala.concurrent.ExecutionContext.Implicits.global

    val checkoutEndpoint = "subscribe/digital/checkout?displayCheckout=true"
    val createDigitalSubscriptionEndpoint = "subscribe/digital/create"

    def fakeDigitalSubscription(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: HttpIdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String])
    ): DigitalSubscription = {

      val settingsProvider = mock[SettingsProvider]
      when(settingsProvider.settings()).thenReturn(
        Settings(Switches(PaymentMethodsSwitch(On, On, None), PaymentMethodsSwitch(On, On, Some(On)), Map.empty, On))
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

      new DigitalSubscription(
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

    def fakeShowCheckoutRequestAuthenticatedWith(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: HttpIdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String])
    ): Future[Result] = {
      fakeDigitalSubscription(actionRefiner, identityService).displayForm("UK", true, true)(FakeRequest()) //calls subscribe/digital/checkout
    }

    val testBody = CreateSupportWorkersRequest(
      firstName = "blah",
      lastName = "bleh",
      country = Country("FR", "France"),
      state = None,
      product = DigitalPack(GBP, Monthly),
      paymentFields = StripePaymentFields("some token"),
      ophanIds = OphanIds(None, None, None),
      referrerAcquisitionData = ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None),
      supportAbTests = Set(),
      email = "bleh@blah.com"
    )

    implicit val req = FakeRequest(
      method = "POST",
      uri = createDigitalSubscriptionEndpoint,
      headers = FakeHeaders(
        Seq("Content-type" -> "application/json")
      ),
      body = testBody
    )
    //    implicit val fakeRequest = FakeRequest().withBody(testBody)

    def fakeCreateDigitalPackRequest(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: HttpIdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String]),
      supportWorkersRequest: CreateSupportWorkersRequest = testBody
    ): Future[Result] = {
      fakeDigitalSubscription(actionRefiner, identityService).create(req) //calls subscribe/digital/create
    }
  }

  "GET subscribe/digital/checkout?displayCheckout=true" should {

    "redirect unauthenticated user to signup page" in new DigitalSubscriptionsMocks {
      val result = fakeShowCheckoutRequestAuthenticatedWith(actionRefiner = loggedOutActionRefiner)
      status(result) mustBe 303
      header("Location", result).value must startWith("https://identity-url.local")
    }

    "return a 500 if the call to get additional data from identity fails" in new DigitalSubscriptionsMocks {
      val result = fakeShowCheckoutRequestAuthenticatedWith(
        identityService = mockedIdentityService(authenticatedIdUser.user -> "not found".asLeft)
      )
      status(result) mustBe 500
    }

    "return form if user is signed in and call to identity is successful" in new DigitalSubscriptionsMocks {
      val result = fakeShowCheckoutRequestAuthenticatedWith(actionRefiner = loggedInActionRefiner)

      status(result) mustBe 200
      contentAsString(result) must include("digitalSubscriptionCheckoutPage.js")
    }

  }

  "POST subscribe/digital/create" should {
    "do something reasonable" in new DigitalSubscriptionsMocks {
      val result: Future[Result] = fakeCreateDigitalPackRequest(actionRefiner = loggedInActionRefiner)

      status(result) mustBe 200
      contentAsString(result) mustBe ""
    }
  }

}
