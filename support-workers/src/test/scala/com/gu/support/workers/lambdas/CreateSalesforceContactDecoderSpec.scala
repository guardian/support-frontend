package com.gu.support.workers.lambdas

import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.Domestic
import com.gu.support.workers.JsonFixtures._
import com.gu.support.workers.states.CreateSalesforceContactState
import com.gu.support.workers.{GuardianWeekly, Monthly, PayPalReferenceTransaction, PaymentMethod}
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar

class CreateSalesforceContactDecoderSpec extends AnyFlatSpec with Matchers with MockitoSugar with LazyLogging {

  "CreateSalesforceContactDecoder" should "be able to decode a CreateSalesforceContactState" in {
    val state = decode[CreateSalesforceContactState](createSalesForceGiftContactJson)
    val result = state.toOption.get
    result.product should be(GuardianWeekly(GBP, Monthly, Domestic))
    result.paymentMethod match {
      case _: PayPalReferenceTransaction => succeed
      case _ => fail()
    }
  }

  it should "fail when given duff json" in {
    val duffJson =
      """
                {
                  "aintIt": "Funky"
                }
                """
    val result = decode[CreateSalesforceContactState](duffJson)
    result.isLeft should be(true)
  }

  "Decoder" should "be able to decode PaymentMethod" in {
    val result = decode[PaymentMethod](payPalPaymentMethod)
    result.isRight should be(true)
  }
}
