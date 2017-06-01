package com.gu.zuora

import com.gu.zuora.Fixtures._
import com.gu.zuora.encoding.CustomCodecs._
import com.gu.zuora.model._
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.{FlatSpec, Matchers}

class SerialisationSpec extends FlatSpec with Matchers with LazyLogging {

  "Account" should "serialise to correct json" in {
    val json = account.asJson
    (json \\ "Currency").head.asString should be(Some("GBP"))
    (json \\ "PaymentGateway").head.asString should be(Some("Stripe Gateway 1"))
  }

  "PaymentMethod" should "serialise to correct json" in {
    val json = creditCardPaymentMethod.asJson
  }

  "SubscribeRequest" should "serialise to correct json" in {
    val json = subscriptionRequest.asJson
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
    val decodeResponse = decode[List[SubscribeResponseAccount]](subscribeResponse)
    decodeResponse.isRight should be(true)
  }

  "GetAccountResponse" should "deserialise from json" in {
    val decodeResult = decode[GetAccountResponse](Fixtures.getAccountResponse)
    decodeResult.isRight should be(true)
    decodeResult.right.get.basicInfo.accountNumber should be(Fixtures.accountNumber)
  }

}
