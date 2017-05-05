package com.gu.zuora

import com.gu.zuora.Fixtures._
import com.gu.zuora.model._
import com.typesafe.scalalogging.LazyLogging
import io.circe.Printer
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import org.scalatest.{FlatSpec, Matchers}

class SerialisationSpec extends FlatSpec with Matchers with LazyLogging with CustomCodecs {

  "ZuoraResponse" should "deserialise from correct json" in {
    val response = decode[SubscribeResponse]("""{"Success":"true"}""")
    response.isRight should be (true)
    response.right.get.Success should be (true)
  }

  "Account" should "serialise to correct json" in {
    val json = account.asJson
    (json \\ "Currency").head.asString should be(Some("GBP"))
    (json \\ "PaymentGateway").head.asString should be(Some("Stripe Gateway 1"))
  }

  "PaymentMethod" should "serialise to correct json" in {
    val json = creditCardPaymentMethod.asJson
    logger.info(json.spaces2)
  }

  "SubscribeRequest" should "serialise to correct json" in {
    val json = subscriptionRequest.asJson
    (json \\ "GenerateInvoice").head.asBoolean should be (Some(true))
    logger.info(json.pretty(Printer.spaces2.copy(dropNullKeys = true)))
  }

  "GetAccountResponse" should "deserialise from json" in {
    val decodeResult = decode[GetAccountResponse](Fixtures.getAccountResponse)
    decodeResult.isRight should be(true)
    decodeResult.right.get.basicInfo.accountNumber should be(Fixtures.accountNumber)
  }

}
