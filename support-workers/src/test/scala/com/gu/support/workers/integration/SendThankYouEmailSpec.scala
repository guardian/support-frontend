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
import com.gu.support.config.TouchPointEnvironments.SANDBOX
import com.gu.support.config.{PromotionsConfig, PromotionsDiscountConfig, PromotionsTablesConfig}
import com.gu.support.promotions.{PromotionCollection, PromotionService, SimplePromotionCollection}
import com.gu.support.workers.GiftRecipient.DigitalSubscriptionGiftRecipient
import com.gu.support.workers.GiftPurchase.DigitalSubscriptionGiftPurchase
import com.gu.support.workers.JsonFixtures.{thankYouEmailJson, wrapFixture}
import com.gu.support.workers._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.integration.TestData.{directDebitPaymentMethod, directDebitPurchaseInfo}
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.support.workers.states.{PaymentMethodWithSchedule, PurchaseInfo}
import com.gu.support.workers.states.SendThankYouEmailProductSpecificState.ContributionCreated
import com.gu.support.workers.states.SendThankYouEmailProductSpecificState.SendThankYouEmailDigitalSubscriptionState.SendThankYouEmailDigitalSubscriptionDirectPurchaseState
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

    sendThankYouEmail.handleRequestFuture(wrapFixture(thankYouEmailJson()), outStream, context).map { _ =>

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
      user,
      SfContactId("sfContactId"),
      new DateTime(1999, 12, 31, 11, 59),
    ).build(
      ContributionCreated(
        Contribution(20, GBP, Monthly),
        directDebitPurchaseInfo,
      )
    ).map { ef =>
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

  def send(eventualEF: Future[List[EmailFields]]): Unit = {
    val service = new EmailService(realConfig.contributionThanksQueueName)
    Await.ready(eventualEF.flatMap(efList => Future.sequence(efList.map(service.send))), Duration.Inf)
  }
  def sendSingle(ef: Future[EmailFields]): Unit = {
    val service = new EmailService(realConfig.contributionThanksQueueName)
    Await.ready(ef.flatMap(service.send), Duration.Inf)
  }
}
import com.gu.support.workers.integration.SendThankYouEmailManualTest._
import com.gu.support.workers.integration.TestData._
object SendContributionEmail extends App {

  val ef = new ContributionEmailFields(
    getMandate,
    billingOnlyUser,
    salesforceContactId,
    new DateTime(1999, 12, 31, 11, 59),
  ).build(
    ContributionCreated(
      Contribution(20, GBP, Monthly),
      directDebitPurchaseInfo,
    )
  )
  sendSingle(ef)

}
object SendDigitalPackEmail extends App {

  send(digitalPackEmailFields.build(
    DigitalSubscriptionDirectPurchaseCreated(
      DigitalPack(GBP, Annual),
      directDebitPurchaseInfo,
    )
  ))

}
object SendDigitalPackCorpEmail extends App {

  send(digitalPackEmailFields.build(
    DigitalSubscriptionDirectPurchaseCreated(
      DigitalPack(GBP, Annual, ReaderType.Corporate)
    )
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
    Some(DigitalSubscriptionGiftPurchase(
      DigitalSubscriptionGiftRecipient("first", "last", addressToSendTo, Some("gift message"), new LocalDate(2020, 10, 2)),
      GeneratedGiftCode("gd12-12345678").get,
      new LocalDate(2020, 10, 14),
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

  val directDebitPurchaseInfo: PurchaseInfo =
    PurchaseInfo(
      directDebitPaymentMethod,
      PaymentSchedule(List(Payment(new LocalDate(2019, 3, 25), 37.50))),
      None,
      "acno",
      "A-S00045678",
    )

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

  val getMandate = (_: String) => Future.successful(Some("65HK26E"))

  val promotionService = new PromotionService(
    PromotionsConfig(PromotionsDiscountConfig("", ""), PromotionsTablesConfig("", "")),
    Some(new SimplePromotionCollection(Nil))
  )

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

  val digitalPackEmailFields = new DigitalPackEmailFields(
    new PaperFieldsGenerator(
      promotionService,
      getMandate,
    ),
    getMandate,
    SANDBOX,
    billingOnlyUser,
    salesforceContactId,
  )

}
