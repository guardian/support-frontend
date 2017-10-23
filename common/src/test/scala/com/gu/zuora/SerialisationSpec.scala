package com.gu.zuora

import com.gu.i18n.Currency.GBP
import com.gu.zuora.Fixtures._
import com.gu.zuora.encoding.CustomCodecs._
import com.gu.zuora.model.response._
import com.typesafe.scalalogging.LazyLogging
import io.circe
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.{FlatSpec, Matchers}

class SerialisationSpec extends FlatSpec with Matchers with LazyLogging {

  "Account" should "serialise to correct json" in {
    val json = account(GBP).asJson
    (json \\ "Currency").head.asString should be(Some("GBP"))
    (json \\ "PaymentGateway").head.asString should be(Some("Stripe Gateway 1"))
  }

  "PaymentMethod" should "serialise to correct json" in {
    val json = creditCardPaymentMethod.asJson
  }

  "SubscribeRequest" should "serialise to correct json" in {
    val json = subscriptionRequest().asJson
    (json \\ "GenerateInvoice").head.asBoolean should be(Some(true))
    (json \\ "sfContactId__c").head.asString.get should be(salesforceId)
  }

  "InvoiceResult" should "deserialise correctly" in {
    val decodeResponse = decode[InvoiceResult](invoiceResult)
    decodeResponse.isRight should be(true)
  }

  "SubscribeResponseAccount" should "deserialise correctly" in {
    val decodeResponse = decode[SubscribeResponseAccount](subscribeResponseAccount)
    decodeResponse.isRight should be(true)
  }

  "SubscribeResponse" should "deserialise correctly" in {
    val decodeResponse = decode[List[SubscribeResponseAccount]](subscribeResponseAnnual)
    decodeResponse.isRight should be(true)
  }

  "GetAccountResponse" should "deserialise from json" in {
    val decodeResult = decode[GetAccountResponse](Fixtures.getAccountResponse)
    decodeResult.isRight should be(true)
    decodeResult.right.get.basicInfo.accountNumber should be(Fixtures.accountNumber)
  }

  "Error" should "deserialise correctly" in {

    val decodeResult = decode[ZuoraError](Fixtures.error)
    decodeResult.isRight should be(true)
    decodeResult.right.get.Code should be("53100320")
  }

  "ErrorResponse" should "deserialise correctly" in {
    //The Zuora api docs say that the subscribe action returns a ZuoraErrorResponse
    //but actually it returns a list of those.
    val decodeResult = decode[List[ZuoraErrorResponse]](Fixtures.errorResponse)
    decodeResult match {
      case r: Right[circe.Error, List[ZuoraErrorResponse]] => logger.info("right")
      case l: Left[circe.Error, List[ZuoraErrorResponse]] => logger.info("left")
    }
    decodeResult.isRight should be(true)
    decodeResult.right.get.head.errors.size should be(1)
    decodeResult.right.get.head.errors.head.Code should be("MISSING_REQUIRED_VALUE")
  }

}
