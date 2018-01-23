package com.gu.support.workers.lambdas

import com.gu.support.workers.Fixtures.{validBaid, _}
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model._
import com.gu.support.workers.model.monthlyContributions.state.CreatePaymentMethodState
import com.gu.zuora.encoding.CustomCodecs._
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class CreatePaymentMethodStateDecoderSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  "CreatePaymentMethodStateDecoder" should "be able to decode a monthly contribution with PayPal payment fields" in {
    val state = decode[CreatePaymentMethodState](createPayPalPaymentMethodJson())
    val result = state.right.get
    result.contribution.amount should be(5)
    result.paymentFields.isInstanceOf[PayPalPaymentFields] should be(true)
    result.paymentFields.asInstanceOf[PayPalPaymentFields].baid should be(validBaid)
  }

  it should "be able to decode a monthly contribution with Stripe payment fields" in {
    val state = decode[CreatePaymentMethodState](createStripePaymentMethodJson(Monthly))
    val result = state.right.get
    result.contribution.amount should be(5)
    result.contribution.billingPeriod should be(Monthly)
    result.paymentFields.isInstanceOf[StripePaymentFields] should be(true)
    result.paymentFields.asInstanceOf[StripePaymentFields].stripeToken should be(stripeToken)
  }

  it should "be able to decode an annual contribution with Stripe payment fields" in {
    val state = decode[CreatePaymentMethodState](createStripePaymentMethodJson(Annual, 150))
    val result = state.right.get
    result.contribution.amount should be(150)
    result.contribution.billingPeriod should be(Annual)
    result.paymentFields.isInstanceOf[StripePaymentFields] should be(true)
    result.paymentFields.asInstanceOf[StripePaymentFields].stripeToken should be(stripeToken)
  }

  "PaymentFieldsDecoder" should "be able to decode an Either[StripePaymentFields, PayPalPaymentFields]" in {
    val stripe = decode[StripePaymentFields](stripeJson)
    val stripePaymentFields = stripe.right.get

    stripePaymentFields.userId should be("12345")
    stripePaymentFields.stripeToken should be(stripeToken)

    val payPal = decode[PayPalPaymentFields](payPalJson)
    payPal.right.get.baid should be(validBaid)

    val dd = decode[DirectDebitPaymentFields](directDebitJson)
    dd.right.get.accountHolderName should be("Mickey Mouse")
  }

  it should "fail when given duff json" in {
    val duffJson = """
                {
                  "aintIt": "Funky"
                }
                """
    val result = decode[PaymentFields](duffJson)
    result.isLeft should be(true)
  }

}
