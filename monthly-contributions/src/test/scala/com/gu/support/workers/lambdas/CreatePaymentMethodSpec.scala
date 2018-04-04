package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.amazonaws.services.lambda.runtime.Context
import com.gu.config.Configuration
import com.gu.i18n.Currency
import com.gu.i18n.Currency.GBP
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.Stripe.{StripeError, StripeList}
import com.gu.stripe.{Stripe, StripeService}
import com.gu.support.workers.AsyncLambdaSpec
import com.gu.support.workers.Fixtures.{validBaid, _}
import com.gu.support.workers.encoding.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.exceptions.RetryNone
import com.gu.support.workers.model.monthlyContributions.state.CreateSalesforceContactState
import com.gu.support.workers.model.{CreditCardReferenceTransaction, PayPalReferenceTransaction, PaymentMethod}
import com.gu.test.tags.objects.IntegrationTest
import com.gu.zuora.encoding.CustomCodecs._
import org.mockito.Matchers._
import org.mockito.Mockito._

import scala.concurrent.Future
import scala.concurrent.duration._

class CreatePaymentMethodSpec extends AsyncLambdaSpec {

  "CreatePaymentMethod" should "retrieve a valid PayPalReferenceTransaction when given a valid baid" taggedAs IntegrationTest in {
    val createPaymentMethod = new CreatePaymentMethod()

    val outStream = new ByteArrayOutputStream()

    createPaymentMethod.handleRequest(wrapFixture(createPayPalPaymentMethodJson()), outStream, context)

    //Check the output
    val createSalesforceContactState = Encoding.in[CreateSalesforceContactState](outStream.toInputStream)

    createSalesforceContactState.isSuccess should be(true)
    createSalesforceContactState.get._1.paymentMethod match {
      case payPal: PayPalReferenceTransaction =>
        payPal.paypalBaid should be(validBaid)
        payPal.paypalEmail should be("membership.paypal-buyer@theguardian.com")
      case _ => fail()
    }
  }

  it should "retrieve a valid CreditCardReferenceTransaction when given a valid stripe token" in {

    val createPaymentMethod = new CreatePaymentMethod(mockServices)

    val outStream = new ByteArrayOutputStream()

    createPaymentMethod.handleRequest(wrapFixture(createStripePaymentMethodJson()), outStream, context)

    //Check the output
    val createSalesforceContactState = Encoding.in[CreateSalesforceContactState](outStream.toInputStream)

    createSalesforceContactState.isSuccess should be(true)
    createSalesforceContactState.get._1.paymentMethod match {
      case stripe: CreditCardReferenceTransaction =>
        stripe.tokenId should be("1234")
      case _ => fail()
    }
  }

  it should "fail when passed invalid json" in {
    a[RetryNone] should be thrownBy {
      val createPaymentMethod = new CreatePaymentMethod()

      val outStream = new ByteArrayOutputStream()

      val inStream = "Test user".asInputStream

      createPaymentMethod.handleRequest(inStream, outStream, mock[Context])

      val p = outStream.toClass[PaymentMethod](encrypted = false)
    }
  }

  "StripeService" should "throw a card_declined StripeError" taggedAs IntegrationTest in {
    val service = new StripeService(Configuration.stripeConfigProvider.get(true), configurableFutureRunner(40.seconds))
    val ex = recoverToExceptionIf[StripeError] {
      service.createCustomer("Test", "tok_chargeDeclined", GBP)
    }
    ex.map(_.code should be(Some("card_declined")))
  }

  private lazy val mockServices = {
    //Mock the stripe service as we cannot actually create a customer
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    val stripe = mock[StripeService]
    val card = Stripe.Source("1234", "visa", "1234", 1, 2099, "GB")
    val customer = Stripe.Customer("12345", StripeList(1, Seq(card)))
    when(stripe.createCustomer(any[String], any[String], any[Currency])).thenReturn(Future(customer))
    when(services.stripeService).thenReturn(stripe)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }
}
