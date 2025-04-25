package com.gu.emailservices

import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.Domestic
import com.gu.support.config.TouchPointEnvironments.CODE
import com.gu.support.workers.integration.TestData
import com.gu.support.workers.integration.TestData.{countryOnlyAddress, directDebitPaymentMethod, officeAddress}
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
      new PaperFieldsGenerator(TestData.getMandate),
      TestData.getMandate,
      CODE,
    ).build(
      SendThankYouEmailDigitalSubscriptionState(
        User("1234", "test@theguardian.com", None, "Mickey", "Mouse", billingAddress = countryOnlyAddress),
        DigitalPack(GBP, Annual),
        directDebitPaymentMethod,
        PaymentSchedule(List(Payment(new LocalDate(2019, 1, 14), 119.90))),
        None,
        "acno",
        "A-S00045678",
        similarProductsConsent = None,
      ),
    ).map(ef => parse(ef.payload))
    actual.map(inside(_) { case actualJson =>
      actualJson should be(expectedJson)
    })
  }
}

class SupporterPlusEmailFieldsSpec extends AsyncFlatSpec with Matchers with Inside {

  it should "generate the right json for SupporterPlus" in {
    val today = new LocalDate(2019, 1, 14)
    val created = new DateTime(2019, 1, 14, 0, 0)
    val expected = parse(s"""
                           |{
                           |  "To" : {
                           |    "Address" : "test@theguardian.com",
                           |    "ContactAttributes" : {
                           |      "SubscriberAttributes" : {
                           |        "first_name" : "Mickey",
                           |        "email_address" : "test@theguardian.com",
                           |        "account name" : "Mickey Mouse",
                           |        "Mandate ID" : "65HK26E",
                           |        "sort code" : "20-20-20",
                           |        "payment method" : "Direct Debit",
                           |        "first payment date" : "Thursday, 24 January 2019",
                           |        "subscription_details" : "£10.00 for the first month, then £12.00 every month",
                           |        "zuorasubscriberid" : "A-S00045678",
                           |        "last_name" : "Mouse",
                           |        "currency" : "GBP",
                           |        "billing_period" : "monthly",
                           |        "account number" : "******11",
                           |        "created" : "$created",
                           |        "product" : "monthly-supporter-plus"
                           |      }
                           |    }
                           |  },
                           |  "DataExtensionName" : "supporter-plus",
                           |  "IdentityUserId" : "1234"
                           |}""".stripMargin)

    val state = SendThankYouEmailSupporterPlusState(
      User(
        "1234",
        "test@theguardian.com",
        None,
        "Mickey",
        "Mouse",
        billingAddress = officeAddress,
        deliveryAddress = Some(officeAddress),
      ),
      SupporterPlus(12, GBP, Monthly),
      directDebitPaymentMethod,
      PaymentSchedule(List(Payment(today, 10), Payment(today.plusMonths(1), 12))),
      None,
      "acno",
      "A-S00045678",
      similarProductsConsent = None,
    )

    val actual = new SupporterPlusEmailFields(
      new PaperFieldsGenerator(TestData.getMandate),
      TestData.getMandate,
      CODE,
      created,
    ).build(state).map(fields => parse(fields.payload))

    actual.map(inside(_) { case actualJson =>
      actualJson should be(expected)
    })

  }
}

class TierThreeEmailFieldsSpec extends AsyncFlatSpec with Matchers with Inside {
  it should "generate the right json for TierThree" in {

    val expected = parse("""
        |{
        |  "To" : {
        |    "Address" : "test@theguardian.com",
        |    "ContactAttributes" : {
        |      "SubscriberAttributes" : {
        |        "subscription_rate" : "£119.90 for the first year",
        |        "date_of_first_paper" : "Monday, 14 January 2019",
        |        "first payment date" : "Monday, 14 January 2019",
        |        "subscriber_id" : "A-S00045678",
        |        "date_of_first_payment" : "Monday, 14 January 2019",
        |        "subscription_details" : "£119.90 for the first year",
        |        "delivery_postcode" : "N1 9AG",
        |        "payment_method" : "Direct Debit",
        |        "delivery_address_line_1" : "90 York Way",
        |        "last_name" : "Mouse",
        |        "delivery_address_line_2" : "",
        |        "EmailAddress" : "test@theguardian.com",
        |        "delivery_country" : "United Kingdom",
        |        "first_name" : "Mickey",
        |        "ZuoraSubscriberId" : "A-S00045678",
        |        "delivery_address_town" : "London",
        |        "bank_sort_code" : "20-20-20",
        |        "mandate_id" : "65HK26E",
        |        "bank_account_no" : "******11",
        |        "billing_period" : "annual",
        |        "account_holder" : "Mickey Mouse"
        |      }
        |    }
        |  },
        |  "DataExtensionName" : "tier-three",
        |  "IdentityUserId" : "1234"
        |}""".stripMargin)

    val today = new LocalDate(2019, 1, 14)
    val state = SendThankYouEmailTierThreeState(
      User(
        "1234",
        "test@theguardian.com",
        None,
        "Mickey",
        "Mouse",
        billingAddress = officeAddress,
        deliveryAddress = Some(officeAddress),
      ),
      TierThree(GBP, Annual, Domestic),
      directDebitPaymentMethod,
      PaymentSchedule(List(Payment(today, 119.90))),
      None,
      "acno",
      "A-S00045678",
      today,
      similarProductsConsent = None,
    )

    val actual = new TierThreeEmailFields(
      new PaperFieldsGenerator(TestData.getMandate),
      CODE,
    ).build(state).map(fields => parse(fields.payload))

    actual.map(inside(_) { case actualJson =>
      actualJson should be(expected)
    })
  }
}
