package com.gu.support.workers.lambdas

import com.gu.i18n.Currency.GBP
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.JsonFixtures.{validBaid, _}
import com.gu.support.workers._
import com.gu.support.workers.states.CreatePaymentMethodState
import com.typesafe.scalalogging.LazyLogging
import io.circe.Json
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar

class CreatePaymentMethodStateDecoderSpec extends AnyFlatSpec with Matchers with MockitoSugar with LazyLogging {

  "Monthly Contribution Product" should "be decodable" in {
    val product: ProductType = Contribution(5, GBP, Monthly)
    assertCodecIsValid(product.asJson)
    /*
    {
      "currency" : "GBP",
      "billingPeriod" : "Monthly",
      "amount" : 5,
      "type" : "Contribution"
    }
     */
  }

  "Annual DigitalPackProduct" should "be decodable" in {
    val product: ProductType = DigitalPack(GBP, Annual)
    assertCodecIsValid(product.asJson)
    /*
    {
      "currency" : "GBP",
      "billingPeriod" : "Annual",
      "type" : "DigitalSubscription"
    }
     */
  }

  private def assertCodecIsValid(json: Json) = {
    val product2 = decode[ProductType](json.noSpaces)
    product2.isRight should be(true) // decoding succeeded
  }

  "CreatePaymentMethodStateDecoder" should "be able to decode a contribution with PayPal payment fields" in {
    val maybeState = decode[CreatePaymentMethodState](createPayPalPaymentMethodContributionJson())

    val fieldsToTest = maybeState.map(state => (state.product, state.paymentFields))
    fieldsToTest should be(
      Right(
        Contribution(5, GBP, Monthly),
        Left(PayPalPaymentFields(validBaid)),
      ),
    )

  }

  it should "be able to decode a contribution with Stripe source payment fields" in {
    val maybeState = decode[CreatePaymentMethodState](createStripeSourcePaymentMethodContributionJson())
    val fieldsToTest = maybeState.map(state => (state.product, state.paymentFields))
    fieldsToTest should be(
      Right(
        Contribution(5, GBP, Monthly),
        Left(StripeSourcePaymentFields(stripeToken, Some(StripePaymentType.StripeCheckout))),
      ),
    )
  }

  it should "be able to decode a contribution with Stripe payment method payment fields" in {
    val maybeState = decode[CreatePaymentMethodState](createStripePaymentMethodPaymentMethodContributionJson())
    val fieldsToTest = maybeState.map(state => (state.product, state.paymentFields))
    fieldsToTest should be(
      Right(
        Contribution(5, GBP, Monthly),
        Left(StripePaymentMethodPaymentFields(stripePaymentMethodToken, Some(StripePaymentType.StripeCheckout))),
      ),
    )
  }

  it should "be able to decode a DigtalBundle with PayPal payment fields" in {
    val state = decode[CreatePaymentMethodState](createPayPalPaymentMethodDigitalPackJson)
    val result = state.getOrElse(fail(state.left.toOption.get.getMessage))
    result.product match {
      case digitalPack: DigitalPack => digitalPack.billingPeriod should be(Annual)
      case _ => fail()
    }
    result.paymentFields match {
      case Left(paypal: PayPalPaymentFields) => paypal.baid should be(validBaid)
      case _ => fail()
    }
  }

  it should "be able to decode a DigitalSubscription with Direct Debit payment fields" in {
    val state = decode[CreatePaymentMethodState](createDirectDebitDigitalPackJson)
    state.fold(
      e => logger.error(s"$e"),
      result => {
        result.product match {
          case digitalPack: DigitalPack => digitalPack.billingPeriod should be(Annual)
          case _ => fail()
        }
        result.paymentFields match {
          case Left(dd: DirectDebitPaymentFields) => dd.accountHolderName should be(mickeyMouse)
          case _ => fail()
        }
      },
    )
  }

}
