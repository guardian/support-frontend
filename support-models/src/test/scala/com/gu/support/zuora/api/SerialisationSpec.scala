package com.gu.support.zuora.api

import com.gu.i18n.Currency.GBP
import com.gu.support.SerialisationTestHelpers
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.PaymentFields
import com.gu.support.zuora.api.Fixtures._
import com.gu.support.zuora.api.response._
import com.typesafe.scalalogging.LazyLogging
import io.circe.Json
import io.circe.parser._
import io.circe.syntax._
import org.joda.time.LocalDate
import org.joda.time.Months.months
import org.scalatest.{Inspectors, Succeeded}
import org.scalatest.flatspec.AsyncFlatSpec

class SerialisationSpec extends AsyncFlatSpec with SerialisationTestHelpers with LazyLogging with Inspectors {

  "Account" should "serialise to correct json" in {
    val json = account(GBP).asJson
    (json \\ "Currency").head.asString should be(Some("GBP"))
    (json \\ "PaymentGateway").head.asString should be(Some("Stripe Gateway 1"))
  }

  it should "deserialise correctly" in {
    testDecoding[Account](s"$accountJson")
  }

  "PaymentFields" should "deserialise correctly" in {
    testDecoding[PaymentFields](directDebitPaymentFieldsJson)
  }

  "ContactDetails" should "deserialise correctly" in {
    testDecoding[ContactDetails](soldToContact, c => c.deliveryInstructions shouldBe Some("Stick it in the shed"))
  }

  "Subscription" should "serialise if it's a non gift" in {
    val json = dsSubscriptionData.asJson
    val expected =
      parse("""
        |{
        |  "RatePlanData" : [
        |    {
        |      "RatePlan" : { "ProductRatePlanId" : "12345" },
        |      "RatePlanChargeData" : [],
        |      "SubscriptionProductFeatureList" : []
        |    }
        |  ],
        |  "Subscription" : {
        |    "ContractEffectiveDate" : "2020-12-01",
        |    "ContractAcceptanceDate" : "2020-12-01",
        |    "TermStartDate" : "2020-12-01",
        |    "AutoRenew" : true,
        |    "InitialTermPeriodType" : "Month",
        |    "InitialTerm" : 12,
        |    "RenewalTerm" : 12,
        |    "TermType" : "TERMED",
        |    "ReaderType__c" : "Direct",
        |    "CreatedRequestId__c" : "requestId"
        |  }
        |}""".stripMargin).toTry.get
    json.mapObject(_.mapValues(_.dropNullValues)) should be(expected)
  }

  it should "serialise if it is a gift" in {
    val json = dsGiftSubscriptionData.asJson
    val expected =
      parse("""
              |{
              |  "RatePlanData" : [
              |    {
              |      "RatePlan" : { "ProductRatePlanId" : "12345" },
              |      "RatePlanChargeData" : [],
              |      "SubscriptionProductFeatureList" : []
              |    }
              |  ],
              |  "Subscription" : {
              |    "ContractEffectiveDate" : "2020-12-01",
              |    "ContractAcceptanceDate" : "2020-12-01",
              |    "TermStartDate" : "2020-12-01",
              |    "AutoRenew" : false,
              |    "InitialTermPeriodType" : "Month",
              |    "InitialTerm" : 3,
              |    "RenewalTerm" : 12,
              |    "TermType" : "TERMED",
              |    "ReaderType__c" : "Gift",
              |    "RedemptionCode__c" : "gd03-asdfghjq",
              |    "CreatedRequestId__c" : "requestId",
              |    "GiftNotificationEmailDate__c" : "2020-12-25"
              |  }
              |}""".stripMargin).toTry.get
    json.mapObject(_.mapValues(_.dropNullValues)) should be(expected)
  }

  "SubscribeRequest" should "serialise to correct json" in {
    val json = creditCardSubscriptionRequest().asJson
    (json \\ "GenerateInvoice").head.asBoolean should be(Some(true))
    (json \\ "sfContactId__c").head.asString.get should be(salesforceId)
    (json \\ "SpecialDeliveryInstructions__c").head.asString.get should be(deliveryInstructions)
  }

  "DiscountRatePlanCharge with fixed end date" should "serialise and deserialize correctly" in {
    val correct = parse("""{
      "ProductRatePlanChargeId" : "12345",
      "DiscountPercentage" : 15.0,
      "UpToPeriods" : 3,
      "UpToPeriodsType" : "Months",
      "EndDateCondition" : "FixedPeriod"
    }""").right.get

    val rpc = DiscountRatePlanCharge("12345", upToPeriods = Some(months(3)), discountPercentage = 15)

    rpc.asJson should be(correct)

    correct
      .as[DiscountRatePlanCharge]
      .fold(
        err => fail(err),
        c => {
          c.productRatePlanChargeId shouldBe "12345"
          c.upToPeriods shouldBe Some(months(3))
          c.discountPercentage shouldBe 15
        },
      )
  }

  "DiscountRatePlanCharge with no end date" should "serialise and deserialize correctly" in {
    val correct = parse("""{
      "ProductRatePlanChargeId" : "12345",
      "DiscountPercentage" : 15.0,
      "EndDateCondition" : "SubscriptionEnd"
    }""").right.get

    val rpc = DiscountRatePlanCharge("12345", discountPercentage = 15, None)

    rpc.asJson should be(correct)

    correct
      .as[DiscountRatePlanCharge]
      .fold(
        err => fail(err),
        c => {
          c.productRatePlanChargeId shouldBe "12345"
          c.upToPeriods shouldBe None
          c.discountPercentage shouldBe 15
        },
      )
  }

  "ContributionRatePlanCharge" should "serialise and deserialize correctly" in {
    testDecoding[ContributionRatePlanCharge](
      Fixtures.contributionRatePlanCharge,
      c => {
        c.productRatePlanChargeId shouldBe "12345"
        c.price shouldBe 15
      },
    )
  }

  "IntroductoryPriceRatePlanCharge" should "serialise correctly" in {
    val correct = parse(s"""{
        "ProductRatePlanChargeId" : "123",
        "Price" : 6,
        "TriggerDate" : "${LocalDate.now}",
        "TriggerEvent" : "SpecificDate"
      }""").right.get

    IntroductoryPriceRatePlanCharge("123", 6, LocalDate.now).asJson shouldBe correct
  }

  "InvoiceResult" should "deserialise correctly" in {
    testDecoding[InvoiceResult](invoiceResult)
  }

  "Subscription" should "serialise correctly" in {
    val encoded = subscription.asJson
    (encoded \\ "InitialPromotionCode__c").map(_ shouldBe Json.fromString(promoCode))
    (encoded \\ "PromotionCode__c").map(_ shouldBe Json.fromString(promoCode))
    succeed
  }

  "SubscribeResponseAccount" should "deserialise correctly" in {
    testDecoding[SubscribeResponseAccount](subscribeResponseAccount)
  }

  "SubscribeResponse" should "deserialise correctly" in {
    testDecoding[List[SubscribeResponseAccount]](subscribeResponseAnnual)
  }

  "PreviewSubscribeResponse" should "deserialise correctly when there is no invoice data" in {
    testDecoding[List[PreviewSubscribeResponse]](previewSubscribeResponseNoInvoice)
  }

  "PreviewSubscribeResponse" should "deserialise correctly when there is invoice data" in {
    testDecoding[List[PreviewSubscribeResponse]](
      previewSubscribeResponseJson,
      response => {
        response.headOption.fold(fail()) { previewSubscribeResponse =>
          previewSubscribeResponse.invoiceData.length shouldBe 1
        }
        response.asJson shouldBe parse(previewSubscribeResponseJson).right.get
      },
    )
  }

  "GetAccountResponse" should "deserialise from json" in {
    testDecoding[GetAccountResponse](
      Fixtures.getAccountResponse,
      _.basicInfo.accountNumber should be(Fixtures.accountNumber),
    )
  }

  "Error" should "deserialise correctly" in {
    testDecoding[ZuoraError](
      Fixtures.error,
      _.Code should be("53100320"),
    )
  }

  "ErrorResponse" should "deserialise correctly" in {
    // The Zuora api docs say that the subscribe action returns a ZuoraErrorResponse
    // but actually it returns a list of those.
    testDecoding[List[ZuoraErrorResponse]](
      Fixtures.errorResponse,
      errs => {
        errs.head.errors.size should be(1)
        errs.head.errors.head.Code should be("MISSING_REQUIRED_VALUE")
      },
    )
  }

  "SubscriptionRedemptionQueryResponse" should "deserialise correctly" in {
    val jsonResponse = """
        {
        "records": [
            {
                "CreatedRequestId__c": "35b4c314-d982-4386-983e-2e8c453f50be",
                "Id": "2c92c0f8742dcaf5017434d002e73a56",
                "ContractEffectiveDate": "2020-08-09"
            }
        ],
        "done": true,
        "size": 1
    }
    """

    testDecoding[SubscriptionRedemptionQueryResponse](
      jsonResponse,
      subResponse => subResponse.records.head.contractEffectiveDate.getDayOfMonth shouldBe 9,
    )
  }

}
