package com.gu.support.workers

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.SerialisationTestHelpers.testRoundTripSerialisation
import com.gu.support.catalog.{Collection, Domestic, Saturday}
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
    testRoundTripSerialisation[SendThankYouEmailState](digitalSubscriptionCorporateRedemptionCreated)
    testRoundTripSerialisation[SendThankYouEmailState](digitalSubscriptionGiftRedemptionCreated)
    testRoundTripSerialisation[SendThankYouEmailState](paperCreated)
    testRoundTripSerialisation[SendThankYouEmailState](guardianWeeklyCreated)
  }

}

object ProductTypeCreatedTestData {

  val contributionCreated = SendThankYouEmailContributionState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    Contribution(1, GBP, Monthly),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    "acno",
    "subno",
  )

  val digitalSubscriptionCorporateRedemptionCreated = SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    DigitalPack(GBP, Monthly, ReaderType.Corporate),
    "acno",
    "subno",
  )
  val digitalSubscriptionGiftRedemptionCreated = SendThankYouEmailDigitalSubscriptionGiftRedemptionState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    DigitalPack(GBP, Monthly, ReaderType.Gift),
    "subno",
    TermDates(
      new LocalDate(2020, 10, 24),
      new LocalDate(2021, 1, 24),
      3,
    ),
  )
  val paperCreated = SendThankYouEmailPaperState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    Paper(fulfilmentOptions = Collection, productOptions = Saturday),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
    new LocalDate(2020, 10, 22),
  )

  val guardianWeeklyCreated = SendThankYouEmailGuardianWeeklyState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    GuardianWeekly(GBP, Monthly, Domestic),
    Some(GiftRecipient.WeeklyGiftRecipient(None, "bob", "builder", Some("bob@thegulocal.com"))),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
    new LocalDate(2020, 10, 22),
  )

}
