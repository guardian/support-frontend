package com.gu.support.workers.lambdas

import java.io.ByteArrayOutputStream

import com.amazonaws.services.lambda.runtime.Context
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.Stripe.StripeList
import com.gu.stripe.{Stripe, StripeService}
import com.gu.support.workers.Conversions.{FromOutputStream, StringInputStreamConversions}
import com.gu.support.workers.Fixtures.{validBaid, _}
import com.gu.support.workers.LambdaSpec
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.exceptions.RetryNone
import com.gu.support.workers.model.monthlyContributions.state.CreateSalesforceContactState
import com.gu.support.workers.model.{CreditCardReferenceTransaction, PayPalReferenceTransaction, PaymentMethod}
import com.gu.test.tags.objects.IntegrationTest
import com.gu.zuora.encoding.CustomCodecs._
import org.mockito.Matchers._
import org.mockito.Mockito._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreatePaymentMethodSpec extends LambdaSpec {

  "CreatePaymentMethod" should "retrieve a valid PayPalReferenceTransaction when given a valid baid" taggedAs IntegrationTest in {
    val createPaymentMethod = new CreatePaymentMethod()

    val outStream = new ByteArrayOutputStream()

    createPaymentMethod.handleRequest(createPayPalPaymentMethodJson.asInputStream(), outStream, context)

    //We can't convert directly to a PayPalReferenceTransaction with Circe, as the structure of the
    //Json produced for a PaymentMethod is different from that for a PayPalReferenceTransaction.
    //See CirceEncodingBehaviourSpec for more details

    outStream.toClass[CreateSalesforceContactState]() match {
      case state @ CreateSalesforceContactState(_, _, _, payPal: PayPalReferenceTransaction) =>
        payPal.paypalBaid should be(validBaid)
        payPal.paypalEmail should be("membership.paypal-buyer@theguardian.com")
      case _ => fail()
    }
  }

  it should "retrieve a valid CreditCardReferenceTransaction when given a valid stripe token" in {

    val createPaymentMethod = new CreatePaymentMethod(mockServices)

    val outStream = new ByteArrayOutputStream()

    createPaymentMethod.handleRequest(createStripePaymentMethodJson.asInputStream(), outStream, context)

    //We can't convert directly to a CreditCardReferenceTransaction with Circe, as the structure of the
    //Json produced for a PaymentMethod is different from that for a CreditCardReferenceTransaction.
    //See CirceEncodingBehaviourSpec for more details
    outStream.toClass[CreateSalesforceContactState]() match {
      case CreateSalesforceContactState(_, _, _, stripe: CreditCardReferenceTransaction) =>
        stripe.tokenId should be("1234")
      case _ => fail()
    }
  }

  it should "fail when passed invalid json" in {
    a[RetryNone] should be thrownBy {
      val createPaymentMethod = new CreatePaymentMethod()

      val outStream = new ByteArrayOutputStream()

      val inStream = "Test user".asInputStream()

      createPaymentMethod.handleRequest(inStream, outStream, mock[Context])

      val p = outStream.toClass[PaymentMethod]()
    }
  }

  lazy val mockServices = {
    //Mock the stripe service as we cannot actually create a customer
    val serviceProvider = mock[ServiceProvider]
    val services = mock[Services]
    val stripe = mock[StripeService]
    val card = Stripe.Card("1234", "visa", "1234", 1, 2099, "GB")
    val customer = Stripe.Customer("12345", StripeList(1, Seq(card)))
    when(stripe.createCustomer(any[String], any[String])).thenReturn(Future(customer))
    when(services.stripeService).thenReturn(stripe)
    when(serviceProvider.forUser(any[Boolean])).thenReturn(services)
    serviceProvider
  }
}
