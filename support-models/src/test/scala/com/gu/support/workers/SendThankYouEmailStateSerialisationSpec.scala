package com.gu.support.workers

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.SerialisationTestHelpers.testRoundTripSerialisation
import com.gu.support.catalog.{Collection, Domestic, Saturday}
import com.gu.support.paperround.AgentId
import com.gu.support.workers.ProductTypeCreatedTestData._
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.zuora.api.ReaderType
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class SendThankYouEmailStateSerialisationSpec extends AnyFlatSpec with Matchers {

  "ProductTypeCreated" should "subclasses roundtrip ok via parent" in {
    testRoundTripSerialisation[SendThankYouEmailState](contributionCreated)
    testRoundTripSerialisation[SendThankYouEmailState](digitalSubscriptionCreated)
    testRoundTripSerialisation[SendThankYouEmailState](paperCreated)
    testRoundTripSerialisation[SendThankYouEmailState](guardianWeeklyCreated)
  }

}

object ProductTypeCreatedTestData {

  val contributionCreated = SendThankYouEmailContributionState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    Contribution(1, GBP, Monthly),
    Some(ProductInformation("Contribution", "Monthly", Some(1))),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    "acno",
    "subno",
    similarProductsConsent = None,
  )

  val digitalSubscriptionCreated = SendThankYouEmailDigitalSubscriptionState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    DigitalPack(GBP, Monthly),
    Some(ProductInformation("DigitalSubscription", "Monthly", None)),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
    similarProductsConsent = None,
  )

  val paperCreated = SendThankYouEmailPaperState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    Paper(
      fulfilmentOptions = Collection,
      productOptions = Saturday,
      deliveryAgent = Some(AgentId(-1)),
    ),
    Some(ProductInformation("SubscriptionCard", "Saturday", None)),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
    new LocalDate(2020, 10, 22),
    similarProductsConsent = None,
  )

  val guardianWeeklyCreated = SendThankYouEmailGuardianWeeklyState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    GuardianWeekly(GBP, Monthly, Domestic),
    Some(ProductInformation("GuardianWeeklyDomestic", "Monthly", None)),
    Some(GiftRecipient(None, "bob", "builder", Some("bob@thegulocal.com"))),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
    new LocalDate(2020, 10, 22),
    similarProductsConsent = None,
  )

}
