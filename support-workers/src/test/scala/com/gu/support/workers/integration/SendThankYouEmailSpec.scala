package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.config.Configuration
import com.gu.emailservices._
import com.gu.i18n.Country
import com.gu.i18n.Country.UK
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{Collection, Domestic, Saturday}
import com.gu.support.config.TouchPointEnvironments.SANDBOX
import com.gu.support.config.{PromotionsConfig, PromotionsDiscountConfig, PromotionsTablesConfig}
import com.gu.support.promotions.{PromotionService, SimplePromotionCollection}
import com.gu.support.workers.GiftRecipient.DigitalSubscriptionGiftRecipient
import com.gu.support.workers.JsonFixtures.{sendAcquisitionEventJson, wrapFixture}
import com.gu.support.workers._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.integration.TestData.{billingOnlyUser, directDebitPaymentMethod}
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.zuora.api.ReaderType
import com.gu.test.tags.objects.IntegrationTest
import com.gu.threadpools.CustomPool.executionContext
import io.circe.Json
import io.circe.generic.auto._
import io.circe.parser._
import org.joda.time.{DateTime, LocalDate}

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

class SendThankYouEmailITSpec extends AsyncLambdaSpec with MockContext {

  "SendThankYouEmail lambda" should "add message to sqs queue" taggedAs IntegrationTest in {
    val sendThankYouEmail = new SendThankYouEmail()

    val outStream = new ByteArrayOutputStream()

    sendThankYouEmail.handleRequestFuture(wrapFixture(sendAcquisitionEventJson), outStream, context).map { _ =>

      val result = Encoding.in[List[SendMessageResult]](outStream.toInputStream)
      result.isSuccess should be(true)
    }
  }

}

class SendThankYouEmailSpec extends AsyncLambdaSpec {

  "EmailFields" should "include Direct Debit fields in the payload" in {
    val mandateId = "65HK26E"
    val user = User("1234", "", None, "", "Mouse", billingAddress = Address(None, None, None, None, None, Country.UK))
    new ContributionEmailFields(
      _ => Future.successful(Some(mandateId)),
      new DateTime(1999, 12, 31, 11, 59),
    ).build(
      SendThankYouEmailContributionState(
        user,
        Contribution(20, GBP, Monthly),
        directDebitPaymentMethod,
        "acno",
        "subno"
      )
    ).map { ef =>
      val resultJson = parse(ef.payload)

      resultJson.isRight should be(true)

      new JsonValidater(resultJson.toOption.get)
        .validate("Mandate ID", mandateId)
        .validate("account name", directDebitPaymentMethod.BankTransferAccountName)
        .validate("account number", "******11")
        .validate("sort code", "20-20-20")
        .validate("first payment date", "Monday, 10 January 2000")
        .validate("payment method", "Direct Debit")
        .validate("currency", "GBP")
        .validate("IdentityUserId", "1234")
      succeed
    }
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
  val identityIdToSendTo = "200004242"
  val giftRecipientSFContactIdToSendTo = SfContactId("0039E000018EoTHQA0")

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

  val queueName = Configuration.load().contributionThanksQueueName

  def send(eventualEF: Future[List[EmailFields]]): Unit = {
    val service = new EmailService(queueName)
    Await.ready(eventualEF.flatMap(efList => Future.sequence(efList.map(service.send))), Duration.Inf)
  }
  def sendSingle(ef: Future[EmailFields]): Unit = {
    val service = new EmailService(queueName)
    Await.ready(ef.flatMap(service.send), Duration.Inf)
  }
}
import com.gu.support.workers.integration.SendThankYouEmailManualTest._
import com.gu.support.workers.integration.TestData._
object SendContributionEmail extends App {

  val ef = new ContributionEmailFields(
    getMandate,
    new DateTime(1999, 12, 31, 11, 59),
  ).build(
    SendThankYouEmailContributionState(
      billingOnlyUser,
      Contribution(20, GBP, Monthly),
      directDebitPaymentMethod,
      acno,
      subno
    )
  )
  sendSingle(ef)

}
object SendDigitalPackEmail extends App {

  send(digitalPackEmailFields.build(
    SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
      billingOnlyUser,
      DigitalPack(GBP, Annual),
      directDebitPaymentMethod,
      paymentSchedule,
      None,
      acno,
      subno,
    )
  ))

}
object SendDigitalPackCorpEmail extends App {

  send(digitalPackEmailFields.build(
    SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(
      billingOnlyUser,
      DigitalPack(GBP, Annual, ReaderType.Corporate),
      acno,
      subno
    )
  ))

}
object SendDigitalPackGiftPurchaseEmails extends App {

  send(digitalPackEmailFields.build(
    SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
      billingOnlyUser,
      giftRecipientSFContactIdToSendTo, // recipient
      DigitalPack(GBP, Annual, ReaderType.Gift),
      DigitalSubscriptionGiftRecipient("first", "last", addressToSendTo, Some("gift message"), LocalDate.now()),
      GeneratedGiftCode("gd12-02345678").get,
      new LocalDate(2020, 10, 14),
      directDebitPaymentMethod,
      paymentSchedule,
      None,
      acno,
      subno
    )
  ))

}
object SendDigitalPackGiftRedemptionEmail extends App {

  send(digitalPackEmailFields.build(
    SendThankYouEmailDigitalSubscriptionGiftRedemptionState(
      billingOnlyUser,
      DigitalPack(GBP, Annual, ReaderType.Gift),
      "subno",
      TermDates(
        new LocalDate(2020, 10, 24),
        new LocalDate(2021, 1, 24),
        3,
      )
    )
  ))

}
object SendPaperSubscriptionEmail extends App {

  sendSingle(new PaperEmailFields(paperFieldsGenerator, SANDBOX).build(
    SendThankYouEmailPaperState(
      officeUser,
      Paper(GBP, Monthly, Collection, Saturday),
      directDebitPaymentMethod,
      PaymentSchedule(List(Payment(new LocalDate(2019, 3, 25), 62.79))),
      None,
      acno,
      subno,
      firstDeliveryDate = new LocalDate(2019, 3, 26)
    )
  ))

}
object SendWeeklySubscriptionEmail extends App {

  sendSingle(new GuardianWeeklyEmailFields(paperFieldsGenerator, SANDBOX).build(
    SendThankYouEmailGuardianWeeklyState(
      officeUser,
      GuardianWeekly(GBP, Quarterly, Domestic),
      None,
      directDebitPaymentMethod,
      PaymentSchedule(List(
        Payment(new LocalDate(2019, 3, 25), 37.50),
        Payment(new LocalDate(2019, 6, 25), 37.50)
      )),
       None,
      acno,
      subno,
      new LocalDate(2019, 3, 26),
    )
  ))

}
object SendWeeklySubscriptionGiftEmail extends App {

  sendSingle(new GuardianWeeklyEmailFields(paperFieldsGenerator, SANDBOX).build(
    SendThankYouEmailGuardianWeeklyState(
      officeUser,
      GuardianWeekly(GBP, Quarterly, Domestic),
      Some(GiftRecipient.WeeklyGiftRecipient(None, "Earl", "Palmer", None)),
      directDebitPaymentMethod,
      PaymentSchedule(List(
        Payment(new LocalDate(2019, 3, 25), 37.50),
        Payment(new LocalDate(2019, 6, 25), 37.50)
      )),
      None,
      acno,
      subno,
      new LocalDate(2019, 3, 26),
    )
  ))

}

object TestData {

  val paymentSchedule = PaymentSchedule(List(Payment(new LocalDate(2019, 3, 25), 37.50)))
  val subno = "A-S00045678"
  val acno = "A123456"

  val countryOnlyAddress = Address(lineOne = None, lineTwo = None, city = None, state = None, postCode = None, country = UK)

  val billingOnlyUser = User(identityIdToSendTo, addressToSendTo, None, "Mickey", "Mouse", billingAddress = countryOnlyAddress)

  val officeAddress = Address(
    lineOne = Some("90 York Way"),
    lineTwo = None,
    city = Some("London"),
    state = None,
    postCode = Some("N1 9AG"),
    country = UK
  )

  val officeUser = User(
    identityIdToSendTo,
    addressToSendTo,
    None,
    "Mickey",
    "Mouse",
    billingAddress = officeAddress,
    deliveryAddress = Some(officeAddress)
  )

  val getMandate = (_: String) => Future.successful(Some("65HK26E"))

  val promotionService = new PromotionService(
    PromotionsConfig(PromotionsDiscountConfig("", ""), PromotionsTablesConfig("", "")),
    Some(new SimplePromotionCollection(Nil))
  )

  val paperFieldsGenerator = new PaperFieldsGenerator(promotionService, getMandate)

  val directDebitPaymentMethod = DirectDebitPaymentMethod(
    FirstName = "Mickey",
    LastName = "Mouse",
    BankTransferAccountName = "Mickey Mouse",
    BankCode = "202020",
    BankTransferAccountNumber = "55779911",
    Country = Country.UK,
    City = Some("London"),
    PostalCode = Some("post code"),
    State = None,
    StreetName = Some("streetname"),
    StreetNumber = Some("123")
  )

  val digitalPackEmailFields = new DigitalPackEmailFields(
    new PaperFieldsGenerator(
      promotionService,
      getMandate,
    ),
    getMandate,
    SANDBOX,
  )

}
