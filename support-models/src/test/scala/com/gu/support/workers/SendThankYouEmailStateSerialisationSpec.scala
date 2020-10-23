package com.gu.support.workers

import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
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
    testRoundTripSerialisation[SendThankYouEmailState](digitalSubscriptionDirectPurchaseCreated)
    testRoundTripSerialisation[SendThankYouEmailState](digitalSubscriptionGiftPurchaseCreated)
    testRoundTripSerialisation[SendThankYouEmailState](digitalSubscriptionCorporateRedemptionCreated)
    testRoundTripSerialisation[SendThankYouEmailState](digitalSubscriptionGiftRedemptionCreated)
    testRoundTripSerialisation[SendThankYouEmailState](paperCreated)
    testRoundTripSerialisation[SendThankYouEmailState](guardianWeeklyCreated)
  }

}

object ProductTypeCreatedTestData {

  val contributionCreated = SendThankYouEmailContributionState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
    Contribution(1, GBP, Monthly),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    "acno",
  )

  val digitalSubscriptionDirectPurchaseCreated = SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
    DigitalPack(GBP, Monthly, ReaderType.Direct),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
  )

  val digitalSubscriptionGiftPurchaseCreated = SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
    DigitalPack(GBP, Monthly, ReaderType.Gift),
    GiftRecipient.DigitalSubscriptionGiftRecipient("bob", "builder", "bob@gu.com", Some("message"), new LocalDate(2020, 10, 2)),
    GeneratedGiftCode("gd12-23456789").get,
    new LocalDate(2020, 10, 14),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    "acno",
  )
  val digitalSubscriptionCorporateRedemptionCreated = SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
    DigitalPack(GBP, Monthly, ReaderType.Corporate),
    "subno"
  )
  val digitalSubscriptionGiftRedemptionCreated = SendThankYouEmailDigitalSubscriptionGiftRedemptionState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
    DigitalPack(GBP, Monthly, ReaderType.Gift)
  )
  val paperCreated = SendThankYouEmailPaperState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
    Paper(fulfilmentOptions = Collection, productOptions = Saturday),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
    new LocalDate(2020, 10, 22)
  )

  val guardianWeeklyCreated = SendThankYouEmailGuardianWeeklyState(
    user = User("111222", "email@blah.com", None, "bertha", "smith", Address(None, None, None, None, None, Country.UK)),
    salesForceContact = SalesforceContactRecord("sfbuy", "sfbuyacid"),
    GuardianWeekly(GBP, Monthly, Domestic),
    Some(GiftRecipient.WeeklyGiftRecipient(None, "bob", "builder", Some("bob@gu.com"))),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
    new LocalDate(2020, 10, 22),
  )

}
