package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.emailservices.{ContributionEmailFields, DigitalPackEmailFields, EmailService}
import com.gu.i18n.Country.UK
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.JsonFixtures.{thankYouEmailJson, wrapFixture}
import com.gu.support.workers._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.threadpools.CustomPool.executionContext
import io.circe.Json
import io.circe.generic.auto._
import io.circe.parser._
import org.joda.time.{DateTime, LocalDate}

@IntegrationTest
class SendThankYouEmailSpec extends LambdaSpec {

  val directDebitPaymentMethod = DirectDebitPaymentMethod(
    firstName = "Mickey",
    lastName = "Mouse",
    bankTransferAccountName = "Mickey Mouse",
    bankCode = "202020",
    bankTransferAccountNumber = "55779911",
    country = Country.UK,
    city = Some("London"),
    postalCode = Some("post cde"),
    state = None,
    streetName = Some("streetname"),
    streetNumber = Some("123")
  )

  "SendThankYouEmail lambda" should "add message to sqs queue" in {
    val sendThankYouEmail = new SendThankYouEmail()

    val outStream = new ByteArrayOutputStream()

    sendThankYouEmail.handleRequest(wrapFixture(thankYouEmailJson()), outStream, context)

    val result = Encoding.in[SendMessageResult](outStream.toInputStream)
    result.isSuccess should be(true)
  }

  ignore should "send a contribution email" in {
    //This test will send a thank you email to the address below - useful for quickly testing changes
    val addressToSendTo = "rupert.bates@theguardian.com"
    val mandateId = "65HK26E"
    val ef = ContributionEmailFields(
      addressToSendTo,
      new DateTime(1999, 12, 31, 11, 59),
      20,
      Currency.GBP,
      "UK", "", Monthly, SfContactId("0036E00000WK8fDQAT"), directDebitPaymentMethod, Some(mandateId)
    )
    val service = new EmailService
    service.send(ef)
  }

  ignore should "send a digital pack email" in {
    //This test will send a thank you email to the address below - useful for quickly testing changes
    val addressToSendTo = "rupert.bates+unitTest@theguardian.com"
    val mandateId = "65HK26E"
    val billingAddressWithCountry = Address(lineOne = None, lineTwo = None, city = None, state = None, postCode = None, country = UK)
    val user = User("1234", addressToSendTo, "Mickey", "Mouse", billingAddress = billingAddressWithCountry)
    val ef = DigitalPackEmailFields(
      "A-S00045678",
      Annual,
      user,
      PaymentSchedule(List(Payment(new LocalDate(2019, 1, 14), 119.90))),
      GBP,
      directDebitPaymentMethod,
      SfContactId("0036E00000WK8fDQAT"),
      Some(mandateId)
    )
    val service = new EmailService
    service.send(ef)
  }

  "EmailFields" should "include Direct Debit fields in the payload" in {
    val mandateId = "65HK26E"
    val ef = ContributionEmailFields(
      "",
      new DateTime(1999, 12, 31, 11, 59),
      20,
      Currency.GBP,
      "UK",
      "",
      Monthly,
      SfContactId("sfContactId"),
      directDebitPaymentMethod,
      Some(mandateId)
    )
    val resultJson = parse(ef.payload)

    resultJson.isRight should be(true)

    new JsonValidater(resultJson.right.get)
      .validate("Mandate ID", mandateId)
      .validate("account name", directDebitPaymentMethod.bankTransferAccountName)
      .validate("account number", "******11")
      .validate("sort code", "20-20-20")
      .validate("first payment date", "Monday, 10 January 2000")
      .validate("payment method", "Direct Debit")
      .validate("currency", "£")
      .validate("SfContactId", "sfContactId")
  }

  class JsonValidater(json: Json) {
    def validate(jsonKey: String, expectedValue: String) = {
      (json \\ jsonKey).head.asString.getOrElse("") should equal(expectedValue)
      this
    }
  }

}
