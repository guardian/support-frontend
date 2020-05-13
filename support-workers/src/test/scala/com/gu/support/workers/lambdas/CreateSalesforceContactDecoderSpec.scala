package com.gu.support.workers.lambdas

import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.JsonFixtures._
import com.gu.support.workers.states.{CreateSalesforceContactState, PaidProduct}
import com.gu.support.workers.{Contribution, PayPalReferenceTransaction, PaymentMethod}
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import io.circe.parser._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar

class CreateSalesforceContactDecoderSpec extends AnyFlatSpec with Matchers with MockitoSugar with LazyLogging {

  "CreateSalesforceContactDecoder" should "be able to decode a CreateSalesforceContactState" in {
    val state = decode[CreateSalesforceContactState](createSalesForceGiftContactJson)
    val result = state.right.get
    result.product match {
      case contribution: Contribution => contribution.amount should be(5)
      case _ => fail()
    }
    result.paymentMethod match {
      case PaidProduct(_: PayPalReferenceTransaction) => succeed
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
