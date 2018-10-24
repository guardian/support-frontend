package com.gu.support.workers.lambdas

import com.gu.i18n.Currency.GBP
import com.gu.support.workers.Fixtures.{validBaid, _}
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model.AccountAccessScope._
import com.gu.support.workers.model._
import com.gu.support.workers.model.states.CreatePaymentMethodState
import com.gu.zuora.encoding.CustomCodecs._
import com.typesafe.scalalogging.LazyLogging
import io.circe.Json
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class CreatePaymentMethodStateDecoderSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {

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
      "type" : "DigitalPack"
    }
     */
  }

  private def assertCodecIsValid(json: Json) = {
    val product2 = decode[ProductType](json.noSpaces)
    product2.isRight should be(true) //decoding succeeded
  }

  "CreatePaymentMethodStateDecoder" should "be able to decode a contribution with PayPal payment fields" in {
    val maybeState = decode[CreatePaymentMethodState](createPayPalPaymentMethodContributionJson())

    val fieldsToTest = maybeState.map(state =>
      (state.product, state.paymentFields))
    fieldsToTest should be(Right(
      Contribution(5, GBP, Monthly),
      PayPalPaymentFields(validBaid)
    ))

  }

  it should "be able to decode a contribution with Stripe payment fields" in {
    val maybeState = decode[CreatePaymentMethodState](createStripePaymentMethodContributionJson())
    val fieldsToTest = maybeState.map(state =>
      (state.product, state.paymentFields))
    fieldsToTest should be(Right(
      Contribution(5, GBP, Monthly),
      StripePaymentFields(stripeToken)
    ))
  }

  it should "be able to decode a DigtalBundle with PayPal payment fields" in {
    val state = decode[CreatePaymentMethodState](createPayPalPaymentMethodDigitalPackJson)
    val result = state.right.get
    result.product match {
      case digitalPack: DigitalPack => digitalPack.billingPeriod should be(Annual)
      case _ => fail()
    }
    result.paymentFields match {
      case paypal: PayPalPaymentFields => paypal.baid should be(validBaid)
      case _ => fail()
    }
  }

  it should "be able to decode a DigitalPack with Direct Debit payment fields" in {
    val state = decode[CreatePaymentMethodState](createDirectDebitDigitalPackJson)
    state.fold(e => logger.error(s"$e"), result => {
      result.product match {
        case digitalPack: DigitalPack => digitalPack.billingPeriod should be(Annual)
        case _ => fail()
      }
      result.paymentFields match {
        case dd: DirectDebitPaymentFields => dd.accountHolderName should be(mickeyMouse)
        case _ => fail()
      }
    })
  }

  it should "be able to decode the old json schema" in {
    val state = decode[CreatePaymentMethodState](oldSchemaContributionJson)
    state.isRight should be(true)
  }

}
