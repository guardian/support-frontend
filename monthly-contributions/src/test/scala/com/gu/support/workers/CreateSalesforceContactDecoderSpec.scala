package com.gu.support.workers

import com.gu.support.workers.Fixtures._
import com.gu.support.workers.model.CreateSalesforceContactState
import com.gu.zuora.model.{PayPalReferenceTransaction, PaymentMethod}
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import io.circe.parser._
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{FlatSpec, Matchers}

class CreateSalesforceContactDecoderSpec extends FlatSpec with Matchers with MockitoSugar with LazyLogging {
  "CreateSalesforceContactDecoder" should "be able to decode a CreateSalesforceContactState" in {
    val state = decode[CreateSalesforceContactState](createSalesForceContactJson)
    val result = state.right.get
    result.amount should be(5)
    result.paymentMethod match {
      case payPal: PayPalReferenceTransaction => succeed
      case _ => fail()
    }
  }

  it should "fail when given duff json" in {
    val duffJson = """
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
