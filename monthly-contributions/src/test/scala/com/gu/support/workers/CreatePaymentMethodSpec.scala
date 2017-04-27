package com.gu.support.workers

import java.io.ByteArrayOutputStream

import com.amazonaws.services.lambda.runtime.Context
import com.gu.stripe.Stripe.StripeList
import com.gu.stripe.{Stripe, StripeService}
import com.gu.support.workers.PaymentFieldsDecoderSpec._
import com.gu.support.workers.lambdas.CreatePaymentMethod
import com.gu.zuora.soap.model.{CreditCardReferenceTransaction, PayPalReferenceTransaction, PaymentMethod}
import com.typesafe.scalalogging.LazyLogging
import io.circe.ParsingFailure
import org.mockito.Mockito._
import org.mockito.Matchers._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global



class CreatePaymentMethodSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  import com.gu.support.workers.Conversions.{FromOutputStream, StringInputStreamConversions}
  import io.circe.generic.auto._

  "CreatePaymentMethod lambda" should "retrieve a valid PayPalReferenceTransaction when given a valid baid" in {
    val createPaymentMethod = new CreatePaymentMethod()

    val outStream = new ByteArrayOutputStream()
    val context = mock[Context]
    when(context.getRemainingTimeInMillis).thenReturn(10000)

    createPaymentMethod.handleRequest(payPalJson.asInputStream(), outStream, context)

    //We can't convert directly to a PayPalReferenceTransaction with Circe, as the structure of the
    //Json produced for a PaymentMethod is different from that for a PayPalReferenceTransaction.
    //See CirceEncodingBehaviourSpec for more details
    outStream.toClass[PaymentMethod]() match {
      case payPal : PayPalReferenceTransaction =>
        payPal.baId should be(validBaid)
        payPal.email should be("membership.paypal-buyer@theguardian.com")
      case _  => fail()
    }
  }

  "CreatePaymentMethod lambda" should "retrieve a valid CreditCardReferenceTransaction when given a valid stripe token" in {

    val createPaymentMethod = new CreatePaymentMethod(stripeService = mockStripeService)

    val outStream = new ByteArrayOutputStream()
    val context = mock[Context]
    when(context.getRemainingTimeInMillis).thenReturn(10000)

    createPaymentMethod.handleRequest(stripeJson.asInputStream(), outStream, context)

    //We can't convert directly to a CreditCardReferenceTransaction with Circe, as the structure of the
    //Json produced for a PaymentMethod is different from that for a CreditCardReferenceTransaction.
    //See CirceEncodingBehaviourSpec for more details
    outStream.toClass[PaymentMethod]() match {
      case stripe: CreditCardReferenceTransaction =>
        stripe.cardId should be("1234")
      case _  => fail()
    }
  }

  lazy val mockStripeService = {
    //Mock the stripe service as we cannot actually create a customer
    val stripeMock = mock[StripeService]
    val card = Stripe.Card("1234", "visa", "1234", 1, 2099, "GB")
    val customer = Stripe.Customer("12345", StripeList(1, Seq(card)))
    when(stripeMock.createCustomer(any[String], any[String])).thenReturn(Future(customer))
    stripeMock
  }

  it should "fail when passed invalid json" in {
    a [ParsingFailure] should be thrownBy {
      val createPaymentMethod = new CreatePaymentMethod()

      val outStream = new ByteArrayOutputStream()

      val inStream = "Test user".asInputStream()

      createPaymentMethod.handleRequest(inStream, outStream, mock[Context])

      val p = outStream.toClass[PaymentMethod]()
      logger.info(s"Output: $p")
    }
  }
}
