package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.emailservices._
import com.gu.i18n.Country.UK
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, Currency}
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{Collection, Domestic, Saturday}
import com.gu.support.workers.JsonFixtures.{thankYouEmailJson, wrapFixture}
import com.gu.support.workers._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.integration.TestData.directDebitPaymentMethod
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.test.tags.objects.IntegrationTest
import com.gu.threadpools.CustomPool.executionContext
import io.circe.Json
import io.circe.generic.auto._
import io.circe.parser._
import org.joda.time.{DateTime, LocalDate}

class SendThankYouEmailIT extends AsyncLambdaSpec with MockContext {

  "SendThankYouEmail lambda" should "add message to sqs queue" taggedAs IntegrationTest in {
    val sendThankYouEmail = new SendThankYouEmail()

    val outStream = new ByteArrayOutputStream()

    sendThankYouEmail.handleRequestFuture(wrapFixture(thankYouEmailJson()), outStream, context).map { _ =>

      val result = Encoding.in[SendMessageResult](outStream.toInputStream)
      result.isSuccess should be(true)
    }
  }

}

class SendThankYouEmailSpec extends LambdaSpec {

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
      Some(directDebitPaymentMethod),
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
    def validate(jsonKey: String, expectedValue: String): JsonValidater = {
      (json \\ jsonKey).head.asString.getOrElse("") should equal(expectedValue)
      this
    }
  }

}

object SendThankYouEmailManualTest {

  //This test will send a thank you email to the address below - useful for quickly testing changes
  val addressToSendTo = "rupert.bates+unitTest@theguardian.com"
  val salesforceContactId = SfContactId("0033E00001BRKTTQA5")

  def main(args: Array[String]): Unit = {
    sendContributionEmail()
    sendDigitalPackEmail()
    sendPaperSubscriptionEmail()
    sendWeeklySubscriptionEmail()
    sendWeeklySubscriptionGiftEmail()
  }

  def sendContributionEmail() {
    val mandateId = "65HK26E"
    val ef = ContributionEmailFields(
      addressToSendTo,
      new DateTime(1999, 12, 31, 11, 59),
      20,
      Currency.GBP,
      "UK", "", Monthly, salesforceContactId, Some(directDebitPaymentMethod), Some(mandateId)
    )
    val service = new EmailService
    service.send(ef)
  }

  def sendDigitalPackEmail() {
    val mandateId = "65HK26E"
    val billingAddressWithCountry = Address(lineOne = None, lineTwo = None, city = None, state = None, postCode = None, country = UK)
    val user = User("1234", addressToSendTo, None, "Mickey", "Mouse", billingAddress = billingAddressWithCountry)
    val ef = DigitalPackEmailFields(
      "A-S00045678",
      Annual,
      user,
      PaymentSchedule(List(Payment(new LocalDate(2019, 1, 14), 119.90))),
      GBP,
      Some(directDebitPaymentMethod),
      salesforceContactId,
      Some(mandateId)
    )
    val service = new EmailService
    service.send(ef)
  }

  def sendPaperSubscriptionEmail() {
    val mandateId = "65HK26E"
    val billingAddressWithCountry = Address(
      lineOne = Some("90 York Way"),
      lineTwo = None,
      city = Some("London"),
      state = None,
      postCode = Some("N1 9AG"),
      country = UK
    )
    val user = User(
      "1234",
      addressToSendTo,
      None,
      "Mickey",
      "Mouse",
      billingAddress = billingAddressWithCountry,
      deliveryAddress = Some(billingAddressWithCountry)
    )
    val ef = PaperEmailFields(
      "A-S00045678",
      Collection,
      Saturday,
      Monthly,
      user,
      PaymentSchedule(List(Payment(new LocalDate(2019, 3, 25), 62.79))),
      Some(new LocalDate(2019, 3, 26)),
      GBP,
      Some(directDebitPaymentMethod),
      salesforceContactId,
      Some(mandateId)
    )
    val service = new EmailService
    service.send(ef)
  }

  def sendWeeklySubscriptionEmail() {
    val mandateId = "65HK26E"
    val billingAddressWithCountry = Address(
      lineOne = Some("90 York Way"),
      lineTwo = None,
      city = Some("London"),
      state = None,
      postCode = Some("N1 9AG"),
      country = UK
    )
    val user = User(
      "1234",
      addressToSendTo,
      None,
      "Mickey",
      "Mouse",
      billingAddress = billingAddressWithCountry,
      deliveryAddress = Some(billingAddressWithCountry)
    )
    val ef = GuardianWeeklyEmailFields(
      "A-S00045678",
      Domestic,
      Quarterly,
      user,
      PaymentSchedule(List(
        Payment(new LocalDate(2019, 3, 25), 37.50),
        Payment(new LocalDate(2019, 6, 25), 37.50)
      )),
      Some(new LocalDate(2019, 3, 26)),
      GBP,
      Some(directDebitPaymentMethod),
      salesforceContactId,
      Some(mandateId),
    )
    val service = new EmailService
    service.send(ef)
  }

  def sendWeeklySubscriptionGiftEmail() {
    val mandateId = "65HK26E"
    val billingAddressWithCountry = Address(
      lineOne = Some("90 York Way"),
      lineTwo = None,
      city = Some("London"),
      state = None,
      postCode = Some("N1 9AG"),
      country = UK
    )
    val user = User(
      "1234",
      addressToSendTo,
      None,
      "Mickey",
      "Mouse",
      billingAddress = billingAddressWithCountry,
      deliveryAddress = Some(billingAddressWithCountry)
    )
    val ef = GuardianWeeklyEmailFields(
      "A-S00045678",
      Domestic,
      Quarterly,
      user,
      PaymentSchedule(List(Payment(new LocalDate(2019, 3, 25), 37.50))),
      Some(new LocalDate(2019, 3, 26)),
      GBP,
      Some(directDebitPaymentMethod),
      salesforceContactId,
      Some(mandateId),
      giftRecipient = Some(GiftRecipient(None, "Earl", "Palmer", None))
    )
    val service = new EmailService
    service.send(ef)
  }

}

object TestData {

  val directDebitPaymentMethod = DirectDebitPaymentMethod(
    firstName = "Mickey",
    lastName = "Mouse",
    bankTransferAccountName = "Mickey Mouse",
    bankCode = "202020",
    bankTransferAccountNumber = "55779911",
    country = Country.UK,
    city = Some("London"),
    postalCode = Some("post code"),
    state = None,
    streetName = Some("streetname"),
    streetNumber = Some("123")
  )

}
