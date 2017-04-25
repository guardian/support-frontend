package com.gu.support.workers

import com.gu.support.workers.PaymentFieldsDecoderSpec._
import com.gu.support.workers.encoding.PaymentFieldsDecoder.decodePaymentFields
import com.gu.support.workers.model.{PayPalPaymentFields, StripePaymentFields}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class PaymentFieldsDecoderSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

  "PaymentFieldsDecoder " should "be able to decode an Either[StripePaymentFields, PayPalPaymentFields]" in {

    val stripe = decode[Either[StripePaymentFields, PayPalPaymentFields]](stripeJson)
    val stripePaymentFields = stripe.right.get.left.get

    stripePaymentFields.userId should be ("12345")
    stripePaymentFields.stripeToken should be (stripeToken)

    val payPal = decode[Either[StripePaymentFields, PayPalPaymentFields]](payPalJson)
    payPal.right.get.right.get.baid should be (validBaid)
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

object PaymentFieldsDecoderSpec{
  val validBaid = "B-23637766K5365543J"
  val payPalJson = s"""
                {
                  "paypalBaid": "$validBaid"
                }
                """
  val stripeToken = "tok_AXY4M16p60c2sg"
  val stripeJson = s"""
                {
                  "userId": "12345",
                  "stripeToken": "$stripeToken"
                }
                """
}