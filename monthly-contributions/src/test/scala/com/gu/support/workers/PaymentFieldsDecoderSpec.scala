package com.gu.support.workers

import com.gu.support.workers.encoding.PaymentFieldsDecoder.decodePaymentFields
import com.gu.support.workers.model.{PayPalPaymentFields, StripePaymentFields}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class PaymentFieldsDecoderSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  "PaymentFieldsDecoder " should "be able to decode an Either[StripePaymentFields, PayPalPaymentFields]" in {
    val payPalJson = """
                {
                  "paypalBaid": "lsdfjsldkfjs"
                }
                """
    val stripeJson = """
                {
                  "userId": "12345",
                  "stripeToken": "5678"
                }
                """
    val stripe = decode[Either[StripePaymentFields, PayPalPaymentFields]](stripeJson)
    val stripePaymentFields = stripe.right.get.left.get

    stripePaymentFields.userId should be ("12345")
    stripePaymentFields.stripeToken should be ("5678")

    val payPal = decode[Either[StripePaymentFields, PayPalPaymentFields]](payPalJson)
    payPal.right.get.right.get.baid should be ("lsdfjsldkfjs")
  }

  it should "fail when given duff json" in {
    val duffJson = """
                {
                  "aintIt": "Funky"
                }
                """
    val result = decode[Either[StripePaymentFields, PayPalPaymentFields]](duffJson)
    result.isLeft should be (true)
  }

}