package com.gu.support.workers

import com.gu.i18n.Currency.GBP
import com.gu.support.SerialisationTestHelpers.testRoundTripSerialisation
import com.gu.support.catalog.{Collection, Domestic, Saturday}
import com.gu.support.workers.ProductTypeCreatedTestData._
import com.gu.support.workers.states.SendThankYouEmailProductSpecificState
import com.gu.support.workers.states.SendThankYouEmailProductSpecificState._
import com.gu.support.zuora.api.ReaderType
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class SendThankYouEmailProductSpecificStateSerialisationSpec extends AnyFlatSpec with Matchers {

  "ProductTypeCreated" should "subclasses roundtrip ok via parent" in {
    testRoundTripSerialisation[SendThankYouEmailProductSpecificState](contributionCreated)
    testRoundTripSerialisation[SendThankYouEmailProductSpecificState](digitalSubscriptionDirectPurchaseCreated)
    testRoundTripSerialisation[SendThankYouEmailProductSpecificState](digitalSubscriptionGiftPurchaseCreated)
    testRoundTripSerialisation[SendThankYouEmailProductSpecificState](digitalSubscriptionCorporateRedemptionCreated)
    testRoundTripSerialisation[SendThankYouEmailProductSpecificState](digitalSubscriptionGiftRedemptionCreated)
    testRoundTripSerialisation[SendThankYouEmailProductSpecificState](paperCreated)
    testRoundTripSerialisation[SendThankYouEmailProductSpecificState](guardianWeeklyCreated)
  }

}

object ProductTypeCreatedTestData {

  val contributionCreated = ContributionCreated(
    Contribution(1, GBP, Monthly),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
  )

  val digitalSubscriptionDirectPurchaseCreated = SendThankYouEmailDigitalSubscriptionDirectPurchaseState(
    DigitalPack(GBP, Monthly, ReaderType.Direct),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
  )

  val digitalSubscriptionGiftPurchaseCreated = SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
    DigitalPack(GBP, Monthly, ReaderType.Gift),
    GiftRecipient.DigitalSubscriptionGiftRecipient("bob", "builder", "bob@gu.com", Some("message"), new LocalDate(2020, 10, 2)),
    GeneratedGiftCode("gd12-23456789").get,
    new LocalDate(2020, 10, 14),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
  )
  val digitalSubscriptionCorporateRedemptionCreated = SendThankYouEmailDigitalSubscriptionCorporateRedemptionState(DigitalPack(GBP, Monthly, ReaderType.Corporate), "subno")
  val digitalSubscriptionGiftRedemptionCreated = SendThankYouEmailDigitalSubscriptionGiftRedemptionState(DigitalPack(GBP, Monthly, ReaderType.Gift))
  val paperCreated = SendThankYouEmailPaperState(
    Paper(fulfilmentOptions = Collection, productOptions = Saturday),
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
    new LocalDate(2020, 10, 22)
  )

  val guardianWeeklyCreated = SendThankYouEmailGuardianWeeklyState(
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
