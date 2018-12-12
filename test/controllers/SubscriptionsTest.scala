package controllers

import actions.CustomActionBuilders
import config.StringsConfig
import org.scalatest.mockito.MockitoSugar.mock
import play.api.test.Helpers.{contentAsString, status, stubControllerComponents}
import scala.concurrent.ExecutionContext.Implicits.global
import cats.implicits._
import org.scalatest.{MustMatchers, WordSpec}
import org.scalatest.OptionValues._
import org.mockito.Mockito.when
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.mvc.Result
import services.HttpIdentityService
import fixtures.TestCSRFComponents
import admin.SwitchState.On
import admin.{PaymentMethodsSwitch, Settings, SettingsProvider, Switches}

import scala.concurrent.Future

class SubscriptionsTest extends WordSpec with MustMatchers with TestCSRFComponents {
  trait DigitalSubscriptionsDisplayForm extends DisplayFormMocks {
    import scala.concurrent.ExecutionContext.Implicits.global

    val checkoutEndpoint = "subscribe/digital/checkout?displayCheckout=true"

    def fakeSubscriptions(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: HttpIdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String])
    ): Subscriptions = {

      val settingsProvider = mock[SettingsProvider]
      when(settingsProvider.settings()).thenReturn(
        Settings(Switches(PaymentMethodsSwitch(On, On, None), PaymentMethodsSwitch(On, On, Some(On)), Map.empty, On))
      )

      new Subscriptions(
        actionRefiner,
        identityService,
        assetResolver,
        stubControllerComponents(),
        new StringsConfig(),
        settingsProvider,
        "support.thegulocal.com"
      )
    }

    def fakeRequestAuthenticatedWith(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: HttpIdentityService = mockedIdentityService(authenticatedIdUser.user -> idUser.asRight[String])
    ): Future[Result] = {
      fakeSubscriptions(actionRefiner, identityService).displayForm("UK", true, true)(FakeRequest())
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
