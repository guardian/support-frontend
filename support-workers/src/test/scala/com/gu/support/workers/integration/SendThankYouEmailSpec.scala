package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream
import com.gu.emailservices._
import com.gu.i18n.Country
import com.gu.i18n.Country.UK
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{Collection, Domestic, Saturday}
import com.gu.support.config.TouchPointEnvironments.CODE
import com.gu.support.config.{PromotionsConfig, PromotionsDiscountConfig, PromotionsTablesConfig}
import com.gu.support.paperround.AgentId
import com.gu.support.paperround.AgentsEndpoint.AgentDetails
import com.gu.support.promotions.{AppliesTo, DiscountBenefit, Promotion, PromotionService, SimplePromotionCollection}
import com.gu.support.workers.JsonFixtures.{sendAcquisitionEventJson, wrapFixture}
import com.gu.support.workers._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.integration.TestData.{billingOnlyUser, directDebitPaymentMethod}
import com.gu.support.workers.integration.util.EmailQueueName
import com.gu.support.workers.integration.util.EmailQueueName.emailQueueName
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.zuora.api.{DirectDebitGateway, ReaderType}
import com.gu.test.tags.objects.IntegrationTest
import com.gu.threadpools.CustomPool.executionContext
import io.circe.Json
import io.circe.parser._
import org.joda.time.{DateTime, LocalDate, Months}
import org.mockito.ArgumentMatchers.any

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

class SendThankYouEmailITSpec extends AsyncLambdaSpec with MockContext {
  "SendThankYouEmail lambda" should "add message to sqs queue" taggedAs IntegrationTest in {
    val sendThankYouEmail = new SendThankYouEmail(emailService = new EmailService(emailQueueName))

    val outStream = new ByteArrayOutputStream()

    sendThankYouEmail.handleRequestFuture(wrapFixture(sendAcquisitionEventJson), outStream, context).map { _ =>
      val result = Encoding.in[Unit](outStream.toInputStream)
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
        Some(ProductInformation("Contribution", "Monthly", Some(20), None, None, None, None)),
        directDebitPaymentMethod,
        "acno",
        "subno",
        similarProductsConsent = None,
      ),
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

  // This test will send a thank you email to the address/SF contact below - useful for quickly testing changes
  val addressToSendTo = "john.duffell@guardian.co.uk"
  val identityIdToSendTo = "200004242"
  val giftRecipientSFContactIdToSendTo = SfContactId("0039E000018EoTHQA0")

  def main(args: Array[String]): Unit = {
    SendContributionEmail.main(args)
    SendSupporterPlusEmail.main(args)
    SendTierThreeEmail.main(args)
    SendDigitalPackEmail.main(args)
    SendPaperSubscriptionEmail.main(args)
    SendWeeklySubscriptionEmail.main(args)
    SendWeeklySubscriptionGiftEmail.main(args)
  }

  def send(eventualEF: Future[EmailFields]): Unit = {
    val service = new EmailService(emailQueueName)
    Await.ready(eventualEF.map(fields => service.send(fields)), Duration.Inf)
  }
  def sendSingle(ef: Future[EmailFields]): Unit = {
    val service = new EmailService(emailQueueName)
    Await.ready(ef.map(service.send), Duration.Inf)
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
      Some(ProductInformation("Contribution", "Monthly", Some(20), None, None, None, None)),
      directDebitPaymentMethod,
      acno,
      subno,
      similarProductsConsent = None,
    ),
  )
  sendSingle(ef)

}

object SendSupporterPlusEmail extends App {

  val supporterPlusPaymentSchedule = PaymentSchedule(
    List(
      Payment(new LocalDate(2024, 1, 8), 10),
      Payment(new LocalDate(2024, 2, 8), 10),
      Payment(new LocalDate(2024, 3, 8), 20),
      Payment(new LocalDate(2024, 4, 8), 20),
      Payment(new LocalDate(2024, 5, 8), 20),
      Payment(new LocalDate(2024, 6, 8), 20),
    ),
  )

  val ef = new SupporterPlusEmailFields(
    new PaperFieldsGenerator(getMandate),
    getMandate,
    CODE,
    new DateTime(1999, 12, 31, 11, 59),
  ).build(
    SendThankYouEmailSupporterPlusState(
      billingOnlyUser,
      SupporterPlus(20, GBP, Monthly),
      Some(ProductInformation("SupporterPlus", "Monthly", Some(20), None, None, None, None)),
      directDebitPaymentMethod,
      supporterPlusPaymentSchedule,
      Some("SUPPORTER_PLUS_PROMO"),
      acno,
      subno,
      similarProductsConsent = None,
    ),
  )
  sendSingle(ef)

}

object SendTierThreeEmail extends App {

  val paymentSchedule = PaymentSchedule(
    List(
      Payment(new LocalDate(2024, 1, 8), 10),
      Payment(new LocalDate(2024, 2, 8), 10),
      Payment(new LocalDate(2024, 3, 8), 20),
      Payment(new LocalDate(2024, 4, 8), 20),
      Payment(new LocalDate(2024, 5, 8), 20),
      Payment(new LocalDate(2024, 6, 8), 20),
    ),
  )

  val ef = new TierThreeEmailFields(
    new PaperFieldsGenerator(getMandate),
    CODE,
  ).build(
    SendThankYouEmailTierThreeState(
      user = officeUser,
      product = TierThree(GBP, Quarterly, Domestic),
      productInformation = Some(
        ProductInformation(
          "TierThree",
          "DomesticQuarterly",
          None,
          deliveryAgent = None,
          deliveryInstructions = None,
          deliveryContact = Some(
            DeliveryContact(
              "bob",
              "builder",
              "test@test.com",
              "GB",
              None,
              "London",
              "test street",
              None,
              "test postcode",
            ),
          ),
          firstDeliveryDate = Some("2020-06-16"),
        ),
      ),
      paymentMethod = directDebitPaymentMethod,
      paymentSchedule = PaymentSchedule(
        List(
          Payment(new LocalDate(2019, 3, 25), 37.50),
          Payment(new LocalDate(2019, 6, 25), 37.50),
        ),
      ),
      promoCode = None,
      accountNumber = acno,
      subscriptionNumber = subno,
      firstDeliveryDate = new LocalDate(2019, 3, 26),
      similarProductsConsent = None,
    ),
  )
  sendSingle(ef)

}

object SendDigitalPackEmail extends App {

  send(
    digitalPackEmailFields.build(
      SendThankYouEmailDigitalSubscriptionState(
        billingOnlyUser,
        DigitalPack(GBP, Annual),
        Some(ProductInformation("DigitalSubscription", "Monthly", None, None, None, None, None)),
        directDebitPaymentMethod,
        paymentSchedule,
        None,
        acno,
        subno,
        similarProductsConsent = None,
      ),
    ),
  )

}

object SendPaperSubscriptionEmail extends App {

  sendSingle(
    new PaperEmailFields(paperFieldsGenerator, CODE).build(
      SendThankYouEmailPaperState(
        officeUser,
        Paper(GBP, Monthly, Collection, Saturday, None),
        Some(
          ProductInformation(
            "SubscriptionCard",
            "Monthly",
            None,
            deliveryAgent = None,
            deliveryInstructions = None,
            deliveryContact = Some(
              DeliveryContact(
                "bob",
                "builder",
                "test@test.com",
                "GB",
                None,
                "London",
                "test street",
                None,
                "test postcode",
              ),
            ),
            firstDeliveryDate = Some("2020-06-16"),
          ),
        ),
        directDebitPaymentMethod,
        PaymentSchedule(List(Payment(new LocalDate(2019, 3, 25), 62.79))),
        None,
        acno,
        subno,
        firstDeliveryDate = new LocalDate(2019, 3, 26),
        similarProductsConsent = None,
      ),
      Some(
        AgentDetails(
          agentName = "Example delivery agent",
          refId = AgentId(912),
          refGroupId = AgentId(1923),
          startDate = "2023-10-09",
          endDate = "2100-01-01",
          address1 = "Somewhere,",
          address2 = "Somewhere,",
          town = "A place!",
          county = "Here",
          postcode = "N1 9GU",
          telephone = "07912345678",
          email = "hello@theguardian.com",
        ),
      ),
    ),
  )

}
object SendWeeklySubscriptionEmail extends App {

  sendSingle(
    new GuardianWeeklyEmailFields(paperFieldsGenerator, CODE).build(
      SendThankYouEmailGuardianWeeklyState(
        officeUser,
        GuardianWeekly(GBP, Quarterly, Domestic),
        Some(
          ProductInformation(
            "GuardianWeeklyDomestic",
            "Quarterly",
            None,
            deliveryAgent = None,
            deliveryInstructions = None,
            deliveryContact = Some(
              DeliveryContact(
                "bob",
                "builder",
                "test@test.com",
                "GB",
                None,
                "London",
                "test street",
                None,
                "test postcode",
              ),
            ),
            firstDeliveryDate = Some("2020-06-16"),
          ),
        ),
        None,
        directDebitPaymentMethod,
        PaymentSchedule(
          List(
            Payment(new LocalDate(2019, 3, 25), 37.50),
            Payment(new LocalDate(2019, 6, 25), 37.50),
          ),
        ),
        None,
        acno,
        subno,
        new LocalDate(2019, 3, 26),
        similarProductsConsent = None,
      ),
    ),
  )

}
object SendWeeklySubscriptionGiftEmail extends App {

  sendSingle(
    new GuardianWeeklyEmailFields(paperFieldsGenerator, CODE).build(
      SendThankYouEmailGuardianWeeklyState(
        officeUser,
        GuardianWeekly(GBP, Quarterly, Domestic),
        Some(
          ProductInformation(
            "GuardianWeeklyDomestic",
            "Quarterly",
            None,
            deliveryAgent = None,
            deliveryInstructions = None,
            deliveryContact = Some(
              DeliveryContact(
                "bob",
                "builder",
                "test@test.com",
                "GB",
                None,
                "London",
                "test street",
                None,
                "test postcode",
              ),
            ),
            firstDeliveryDate = Some("2020-06-16"),
          ),
        ),
        Some(GiftRecipient(None, "Earl", "Palmer", None)),
        directDebitPaymentMethod,
        PaymentSchedule(
          List(
            Payment(new LocalDate(2019, 3, 25), 37.50),
            Payment(new LocalDate(2019, 6, 25), 37.50),
          ),
        ),
        None,
        acno,
        subno,
        new LocalDate(2019, 3, 26),
        similarProductsConsent = None,
      ),
    ),
  )

}

object TestData {

  val paymentSchedule = PaymentSchedule(List(Payment(new LocalDate(2019, 3, 25), 37.50)))
  val subno = "A-S00045678"
  val acno = "A123456"

  val countryOnlyAddress =
    Address(lineOne = None, lineTwo = None, city = None, state = None, postCode = None, country = UK)

  val billingOnlyUser =
    User(identityIdToSendTo, addressToSendTo, None, "Mickey", "Mouse", billingAddress = countryOnlyAddress)

  val officeAddress = Address(
    lineOne = Some("90 York Way"),
    lineTwo = None,
    city = Some("London"),
    state = None,
    postCode = Some("N1 9AG"),
    country = UK,
  )

  val officeUser = User(
    identityIdToSendTo,
    addressToSendTo,
    None,
    "Mickey",
    "Mouse",
    billingAddress = officeAddress,
    deliveryAddress = Some(officeAddress),
  )

  val getMandate = (_: String) => Future.successful(Some("65HK26E"))

  val supporterPlusPromotionService = new PromotionService(
    PromotionsConfig(PromotionsDiscountConfig("", ""), PromotionsTablesConfig("", "")),
    Some(
      new SimplePromotionCollection(
        List(
          Promotion(
            name = "supporter+",
            description = "descpromo",
            appliesTo = AppliesTo(Set("8a128ed885fc6ded018602296ace3eb8" /*s+*/ ), Set(Country.UK)),
            campaignCode = "ccode",
            channelCodes = Map("webchannel" -> Set("SUPPORTER_PLUS_PROMO")),
            starts = DateTime.now,
            expires = None,
            discount = Some(DiscountBenefit(80d, Some(Months.months(3)))),
            freeTrial = None,
            incentive = None,
            renewalOnly = false,
            tracking = false,
            landingPage = None,
          ),
        ),
      ),
    ),
  )

  val promotionService = new PromotionService(
    PromotionsConfig(PromotionsDiscountConfig("", ""), PromotionsTablesConfig("", "")),
    Some(new SimplePromotionCollection(Nil)),
  )

  val paperFieldsGenerator = new PaperFieldsGenerator(getMandate)

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
    StreetNumber = Some("123"),
    PaymentGateway = DirectDebitGateway,
  )

  val digitalPackEmailFields = new DigitalPackEmailFields(
    new PaperFieldsGenerator(
      getMandate,
    ),
    getMandate,
    CODE,
  )

}
