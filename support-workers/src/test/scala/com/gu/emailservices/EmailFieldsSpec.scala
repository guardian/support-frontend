package com.gu.emailservices

import com.gu.i18n.Currency.GBP
import com.gu.support.config.TouchPointEnvironments.SANDBOX
import com.gu.support.workers.integration.TestData
import com.gu.support.workers.integration.TestData.{countryOnlyAddress, directDebitPaymentMethod}
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers._
import io.circe.parser._
import io.circe.syntax._
import org.joda.time.{DateTime, DateTimeZone, LocalDate}
import org.scalatest.Inside
import org.scalatest.flatspec.{AnyFlatSpec, AsyncFlatSpec}
import org.scalatest.matchers.should.Matchers

class EmailFieldsSpec extends AnyFlatSpec with Matchers {
  "EmailPayload" should "serialize to json without scheduled time" in {
    actualSerialisedJson(None) shouldBe expectedQueueJson("")
  }

  "EmailPayload" should "serialize to json with scheduled time" in {
    val dateToUse = new DateTime(2020, 10, 27, 16, 5, 7, 123, DateTimeZone.UTC)
    actualSerialisedJson(Some(dateToUse)) shouldBe expectedQueueJson(
      """, "ScheduledTime": "2020-10-27T16:05:07.123Z"""",
    )
  }

  private def actualSerialisedJson(scheduledTime: Option[DateTime]) = {
    EmailPayload(
      EmailPayloadTo(
        "email@email.com",
        EmailPayloadContactAttributes(
          Map("attribute1" -> "value1", "attribute2" -> "value2"),
        ),
      ),
      "dataExtensionName",
      Some("sfContactId"),
      Some("identityUserId"),
      scheduledTime,
      None,
    ).asJson.dropNullValues
  }

  private def expectedQueueJson(insert: String) = {
    parse(s"""
       |{
       |  "To": {
       |    "Address": "email@email.com",
       |    "ContactAttributes": {
       |      "SubscriberAttributes": { "attribute1" : "value1" ,  "attribute2" : "value2" }
       |    }
       |  },
       |  "DataExtensionName": "dataExtensionName",
       |  "SfContactId": "sfContactId",
       |  "IdentityUserId": "identityUserId"
       |  $insert
       |}
      """.stripMargin).toOption.get
  }
}

class DigitalPackEmailFieldsSpec extends AsyncFlatSpec with Matchers with Inside {

  it should "generate the right json for direct subs" in {
    val expectedJson = parse("""{
        |"To" : {
        |  "Address" : "test@theguardian.com",
        |  "ContactAttributes" : {
        |    "SubscriberAttributes" : {
        |      "first_name" : "Mickey",
        |      "emailaddress" : "test@theguardian.com",
        |      "mandateid" : "65HK26E",
        |      "subscription_details" : "£119.90 for the first year",
        |      "date_of_first_payment" : "Monday, 14 January 2019",
        |      "country" : "United Kingdom",
        |      "trial_period" : "14",
        |      "account_number" : "******11",
        |      "zuorasubscriberid" : "A-S00045678",
        |      "sort_code" : "20-20-20",
        |      "last_name" : "Mouse",
        |      "account_name" : "Mickey Mouse",
        |      "default_payment_method" : "Direct Debit"
        |    }
        |  }
        |},
        |"DataExtensionName" : "digipack",
        |"IdentityUserId" : "1234"
        |}
        |""".stripMargin)
    val actual = new DigitalPackEmailFields(
      new PaperFieldsGenerator(TestData.promotionService, TestData.getMandate),
      TestData.getMandate,
      SANDBOX,
    ).build(
      SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
        User("1234", "test@theguardian.com", None, "Mickey", "Mouse", billingAddress = countryOnlyAddress),
        DigitalPack(GBP, Annual),
        directDebitPaymentMethod,
        PaymentSchedule(List(Payment(new LocalDate(2019, 1, 14), 119.90))),
        None,
        "acno",
        "A-S00045678",
      ),
    ).map(_.map(ef => parse(ef.payload)))
    actual.map(inside(_) { case actualJson :: Nil =>
      actualJson should be(expectedJson)
    })
  }

  it should "generate the right json for gift redemption subs" in {
    val expectedJson = parse("""{
        |  "To" : {
        |    "Address" : "test@theguardian.com",
        |    "ContactAttributes" : {
        |      "SubscriberAttributes" : {
        |        "gift_recipient_first_name" : "Mickey",
        |        "subscription_details" : "3 month digital subscription",
        |        "gift_end_date" : "Thursday, 18 February 2021",
        |        "gift_recipient_email" : "test@theguardian.com",
        |        "gift_start_date" : "Wednesday, 18 November 2020"
        |      }
        |    }
        |  },
        |  "DataExtensionName" : "digipack-gift-redemption",
        |  "IdentityUserId" : "1234",
        |  "UserAttributes" : {
        |    "unmanaged_digital_subscription_gift_duration_months" : 3,
        |    "unmanaged_digital_subscription_gift_start_date" : "2020-11-18",
        |    "unmanaged_digital_subscription_gift_end_date" : "2021-02-18"
        |  }
        |}
        |""".stripMargin)
    val actual = new DigitalPackEmailFields(
      new PaperFieldsGenerator(TestData.promotionService, TestData.getMandate),
      TestData.getMandate,
      SANDBOX,
    ).build(
      SendThankYouEmailDigitalSubscriptionGiftRedemptionState(
        User("1234", "test@theguardian.com", None, "Mickey", "Mouse", billingAddress = countryOnlyAddress),
        DigitalPack(GBP, Annual),
        "subno",
        TermDates(
          new LocalDate(2020, 11, 18),
          new LocalDate(2021, 2, 18),
          3,
        ),
      ),
    ).map(_.map(ef => parse(ef.payload)))
    actual.map(inside(_) { case actualJson :: Nil =>
      actualJson should be(expectedJson)
    })
  }

}
