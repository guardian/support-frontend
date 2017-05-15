package com.gu.support.workers

import com.gu.support.workers.Fixtures.{validBaid, _}
import com.gu.support.workers.encoding.CreatePaymentMethodStateDecoder.{decodeCreatePaymentMethodState, decodePaymentFields}
import com.gu.support.workers.model.{CreatePaymentMethodState, PayPalPaymentFields, StripePaymentFields}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class CreatePaymentMethodStateDecoderSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  "CreatePaymentMethodStateDecoder" should "be able to decode a CreatePaymentMethodStateDecoder with PayPal payment fields" in {
    val state = decode[CreatePaymentMethodState](createPayPalPaymentMethodJson)
    val result = state.right.get
    result.contribution.amount should be(5)
    result.paymentFields.isRight should be(true) //PayPal
    result.paymentFields.right.get.baid should be(validBaid)
  }

  it should "be able to decode a CreatePaymentMethodStateDecoder with Stripe payment fields" in {
    val state = decode[CreatePaymentMethodState](createStripePaymentMethodJson)
    val result = state.right.get
    result.contribution.amount should be(5)
    result.paymentFields.isLeft should be(true) //Stripe
    result.paymentFields.left.get.stripeToken should be(stripeToken)
  }

  "PaymentFieldsDecoder" should "be able to decode an Either[StripePaymentFields, PayPalPaymentFields]" in {
    val stripe = decode[Either[StripePaymentFields, PayPalPaymentFields]](stripeJson)
    val stripePaymentFields = stripe.right.get.left.get

    stripePaymentFields.userId should be("12345")
    stripePaymentFields.stripeToken should be(stripeToken)

    val payPal = decode[Either[StripePaymentFields, PayPalPaymentFields]](payPalJson)
    payPal.right.get.right.get.baid should be(validBaid)
  }

  it should "fail when given duff json" in {
    val duffJson = """
                {
                  "aintIt": "Funky"
                }
                """
    val result = decode[Either[StripePaymentFields, PayPalPaymentFields]](duffJson)
    result.isLeft should be(true)
  }

}
