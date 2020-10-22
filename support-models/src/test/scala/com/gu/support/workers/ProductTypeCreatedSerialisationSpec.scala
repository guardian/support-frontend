package com.gu.support.workers

import com.gu.i18n.Currency.GBP
import com.gu.support.SerialisationTestHelpers.SumTypeChecker
import com.gu.support.catalog.{Collection, Domestic, Saturday}
import com.gu.support.workers.ProductTypeCreatedTestData._
import com.gu.support.workers.states.ProductTypeCreated.DigitalSubscriptionCreated._
import com.gu.support.workers.states.ProductTypeCreated._
import com.gu.support.workers.states.{ProductTypeCreated, PurchaseInfo}
import com.gu.support.zuora.api.ReaderType
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class ProductTypeCreatedSerialisationSpec extends AnyFlatSpec with Matchers {

  "ProductTypeCreated" should "subclasses roundtrip ok via parent" in {
    val sumTypeChecker = new SumTypeChecker[ProductTypeCreated]()
    sumTypeChecker.testRoundTripSerialisationViaParent(contributionCreated)
    sumTypeChecker.testRoundTripSerialisationViaParent(digitalSubscriptionDirectPurchaseCreated)
    sumTypeChecker.testRoundTripSerialisationViaParent(digitalSubscriptionGiftPurchaseCreated)
    sumTypeChecker.testRoundTripSerialisationViaParent(digitalSubscriptionCorporateRedemptionCreated)
    sumTypeChecker.testRoundTripSerialisationViaParent(digitalSubscriptionGiftRedemptionCreated)
    sumTypeChecker.testRoundTripSerialisationViaParent(paperCreated)
    sumTypeChecker.testRoundTripSerialisationViaParent(guardianWeeklyCreated)
  }

}

object ProductTypeCreatedTestData {

  val purchaseInfo = PurchaseInfo(
    PayPalReferenceTransaction("baid", "email@emaail.com"),
    PaymentSchedule(List(Payment(new LocalDate(2020, 6, 16), 1.49))),
    None,
    "acno",
    "subno",
  )

  val contributionCreated = ContributionCreated(Contribution(1, GBP, Monthly), purchaseInfo)

  val digitalSubscriptionDirectPurchaseCreated = DigitalSubscriptionDirectPurchaseCreated(DigitalPack(GBP, Monthly, ReaderType.Direct), purchaseInfo)

  val digitalSubscriptionGiftPurchaseCreated = DigitalSubscriptionGiftPurchaseCreated(
    DigitalPack(GBP, Monthly, ReaderType.Gift),
    GiftRecipient.DigitalSubscriptionGiftRecipient("bob", "builder", "bob@gu.com", Some("message"), new LocalDate(2020, 10, 2)),
    GeneratedGiftCode("gd12-23456789").get,
    new LocalDate(2020, 10, 14),
    purchaseInfo,
  )
  val digitalSubscriptionCorporateRedemptionCreated = DigitalSubscriptionCorporateRedemptionCreated(DigitalPack(GBP, Monthly, ReaderType.Corporate), "subno")
  val digitalSubscriptionGiftRedemptionCreated = DigitalSubscriptionGiftRedemptionCreated(DigitalPack(GBP, Monthly, ReaderType.Gift))
  val paperCreated = PaperCreated(Paper(fulfilmentOptions = Collection, productOptions = Saturday), purchaseInfo, new LocalDate(2020, 10, 22))

  val guardianWeeklyCreated = GuardianWeeklyCreated(
    GuardianWeekly(GBP, Monthly, Domestic),
    Some(GiftRecipient.WeeklyGiftRecipient(None, "bob", "builder", Some("bob@gu.com"))),
    purchaseInfo,
    new LocalDate(2020, 10, 22),
  )

}
