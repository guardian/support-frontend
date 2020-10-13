package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.config.Configuration
import com.gu.emailservices._
import com.gu.i18n.Country
import com.gu.i18n.Country.UK
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{Collection, Saturday}
import com.gu.support.workers.GiftRecipient.DigitalSubGiftRecipient
import com.gu.support.workers.GiftRecipientAndMaybeCode.DigitalSubGiftRecipientWithCode
import com.gu.support.workers.JsonFixtures.{thankYouEmailJson, wrapFixture}
import com.gu.support.workers._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.integration.TestData.directDebitPaymentMethod
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.support.workers.states.PaymentMethodWithSchedule
import com.gu.support.zuora.api.ReaderType
import com.gu.test.tags.objects.IntegrationTest
import com.gu.threadpools.CustomPool.executionContext
import io.circe.Json
import io.circe.generic.auto._
import io.circe.parser._
import org.joda.time.{DateTime, LocalDate}

class SendThankYouEmailITSpec extends AsyncLambdaSpec with MockContext {

  "SendThankYouEmail lambda" should "add message to sqs queue" taggedAs IntegrationTest in {
    val sendThankYouEmail = new SendThankYouEmail()

    val outStream = new ByteArrayOutputStream()

    sendThankYouEmail.handleRequestFuture(wrapFixture(thankYouEmailJson()), outStream, context).map { _ =>

      val result = Encoding.in[List[SendMessageResult]](outStream.toInputStream)
      result.isSuccess should be(true)
    }
  }

}

class SendThankYouEmailSpec extends LambdaSpec {

  "EmailFields" should "include Direct Debit fields in the payload" in {
    val mandateId = "65HK26E"
    val user = User("1234", "", None, "", "Mouse", billingAddress = Address(None, None, None, None, None, Country.UK))
    val ef = ContributionEmailFields.build(
      AllProductsEmailFields(
        Monthly,
        user,
        GBP,
        SfContactId("sfContactId"),
        Some(mandateId)
      ),
      new DateTime(1999, 12, 31, 11, 59),
      20,
      directDebitPaymentMethod
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

  //This test will send a thank you email to the address/SF contact below - useful for quickly testing changes
  val addressToSendTo = "john.duffell@guardian.co.uk"
  val salesforceContactId = SfContactId("0033E00001DTBHJQA5")

  def main(args: Array[String]): Unit = {
    SendContributionEmail.main(args)
    SendDigitalPackEmail.main(args)
    SendDigitalPackCorpEmail.main(args)
    SendDigitalPackGiftPurchaseEmails.main(args)
    SendDigitalPackGiftRedemptionEmail.main(args)
    SendPaperSubscriptionEmail.main(args)
    SendWeeklySubscriptionEmail.main(args)
    SendWeeklySubscriptionGiftEmail.main(args)
  }

  val realConfig = Configuration.load()

  def send(ef: Either[String, List[EmailFields]]): Unit = {
    val service = new EmailService(realConfig.contributionThanksQueueName)
    ef.toOption.get.map(service.send)
  }
  def sendSingle(ef: EmailFields): Unit = {
    val service = new EmailService(realConfig.contributionThanksQueueName)
    service.send(ef)
  }
}
import com.gu.support.workers.integration.SendThankYouEmailManualTest._
import com.gu.support.workers.integration.TestData._
object SendContributionEmail extends App {

  val ef = ContributionEmailFields.build(
    AllProductsEmailFields(
      Monthly,
      billingOnlyUser,
      GBP,
      salesforceContactId,
      Some(mandateId)
    ),
    new DateTime(1999, 12, 31, 11, 59),
    20,
    directDebitPaymentMethod
  )
  val service = new EmailService(realConfig.contributionThanksQueueName)
  service.send(ef)

}
object SendDigitalPackEmail extends App {

  send(new DigitalPackEmailFields(
    subsFields(Annual, billingOnlyUser)
  ).build(
    paidSubPaymentData = Some(PaymentMethodWithSchedule(
      directDebitPaymentMethod,
      PaymentSchedule(List(Payment(new LocalDate(2019, 1, 14), 119.90)))
    )),
    ReaderType.Direct,
    None
  ))

}
object SendDigitalPackCorpEmail extends App {

  send(new DigitalPackEmailFields(
    subsFields(Annual, billingOnlyUser)
  ).build(
    paidSubPaymentData = None,
    ReaderType.Corporate,
    None
  ))

}
object SendDigitalPackGiftPurchaseEmails extends App {

  send(new DigitalPackEmailFields(
    subsFields(Annual, billingOnlyUser)
  ).build(
    paidSubPaymentData = Some(PaymentMethodWithSchedule(
      directDebitPaymentMethod,
      PaymentSchedule(List(Payment(new LocalDate(2019, 1, 14), 119.90)))
    )),
    ReaderType.Gift,
    Some(DigitalSubGiftRecipientWithCode(
      DigitalSubGiftRecipient("first", "last", addressToSendTo, Some("gift message"), new LocalDate(2020, 10, 2)),
      GiftCode("gd12-12345678").get
    )
  )))

}
object SendDigitalPackGiftRedemptionEmail extends App {

  send(new DigitalPackEmailFields(
    subsFields(Annual, billingOnlyUser)
  ).build(
    paidSubPaymentData = None,
    ReaderType.Gift,
    None
  ))

}
object SendPaperSubscriptionEmail extends App {

  sendSingle(PaperEmailFields.build(
    subsFields(
        Monthly,
        officeUser),
    Collection,
    Saturday,
    Some(new LocalDate(2019, 3, 26)),
    PaymentMethodWithSchedule(directDebitPaymentMethod, PaymentSchedule(List(Payment(new LocalDate(2019, 3, 25), 62.79)))),
  ))

}
object SendWeeklySubscriptionEmail extends App {

  sendSingle(GuardianWeeklyEmailFields.build(
    subsFields(
        Quarterly,
        officeUser),
    Some(new LocalDate(2019, 3, 26)),
    PaymentMethodWithSchedule(directDebitPaymentMethod, PaymentSchedule(List(
      Payment(new LocalDate(2019, 3, 25), 37.50),
      Payment(new LocalDate(2019, 6, 25), 37.50)
    ))),
  ))

}
object SendWeeklySubscriptionGiftEmail extends App {

  sendSingle(GuardianWeeklyEmailFields.build(
    subsFields(Quarterly, officeUser),
    Some(new LocalDate(2019, 3, 26)),
    PaymentMethodWithSchedule(directDebitPaymentMethod, PaymentSchedule(List(Payment(new LocalDate(2019, 3, 25), 37.50)))),
    giftRecipient = Some(GiftRecipient.WeeklyGiftRecipient(None, "Earl", "Palmer", None))
  ))

}

object TestData {

  def subsFields(billingPeriod: BillingPeriod, user: User): SubscriptionEmailFields = {
    SubscriptionEmailFields(
      AllProductsEmailFields(
        billingPeriod,
        user,
        GBP,
        salesforceContactId,
        Some(mandateId)
      ),
      "A-S00045678",
      None
    )
  }

  val countryOnlyAddress = Address(lineOne = None, lineTwo = None, city = None, state = None, postCode = None, country = UK)

  val billingOnlyUser = User("1234", addressToSendTo, None, "Mickey", "Mouse", billingAddress = countryOnlyAddress)

  val officeAddress = Address(
    lineOne = Some("90 York Way"),
    lineTwo = None,
    city = Some("London"),
    state = None,
    postCode = Some("N1 9AG"),
    country = UK
  )

  val officeUser = User(
    "1234",
    addressToSendTo,
    None,
    "Mickey",
    "Mouse",
    billingAddress = officeAddress,
    deliveryAddress = Some(officeAddress)
  )

  val mandateId = "65HK26E"

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
