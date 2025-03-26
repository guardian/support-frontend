package com.gu.zuora.subscriptionBuilders

import com.gu.helpers.DateGenerator
import com.gu.i18n.Country
import com.gu.i18n.CountryGroup.UK
import com.gu.i18n.Currency.GBP
import com.gu.salesforce.Salesforce.SalesforceContactRecords
import com.gu.support.catalog.Domestic
import com.gu.support.config.TouchPointEnvironments.CODE
import com.gu.support.promotions.{Promotion, PromotionService, PromotionWithCode}
import com.gu.support.workers._
import com.gu.support.workers.states.{AnalyticsInfo, CreateZuoraSubscriptionState}
import com.gu.support.zuora.api.AcquisitionSource.CSR
import com.gu.support.zuora.api.ReaderType.{Direct, Patron}
import com.gu.support.zuora.api.{Day, Month, SubscriptionData}
import com.gu.zuora.subscriptionBuilders.GuardianWeeklySubscriptionBuilder.initialTermInDays
import org.joda.time.LocalDate
import org.mockito.ArgumentMatchers
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar._

import java.util.UUID

class GuardianWeeklySubscriptionBuildersSpec extends AnyFlatSpec with Matchers {

  "InitialTermLength" should "be correct" in {
    val termStart = new LocalDate(2019, 2, 3)
    val firstPaperDate = termStart.plusDays(3)
    val termLength = initialTermInDays(termStart, firstPaperDate, 3)
    termLength shouldBe 92
  }

  "SubscriptionData for a gift subscription" should "have autoRenew set to false" in (
    gift.subscription.autoRenew shouldBe false
  )

  it should "have the contractAcceptanceDate set to the first delivery date" in (
    gift.subscription.contractAcceptanceDate shouldBe firstDeliveryDate
  )

  it should "have the contractEffectiveDate and the termStartDate set to the date it was sold" in {
    gift.subscription.contractEffectiveDate shouldBe saleDate
    gift.subscription.termStartDate shouldBe saleDate
  }

  it should "have an initial term of 95 days" in {
    gift.subscription.initialTerm shouldBe 95
    gift.subscription.initialTermPeriodType shouldBe Day
  }

  it should "have the correct productRatePlanId" in (
    gift.ratePlanData.head.ratePlan.productRatePlanId shouldBe "2c92c0f96ded216a016df491134d4091"
  )

  "SubscriptionData for a non-gift subscription" should "have autoRenew set to true" in {
    nonGift.subscription.autoRenew shouldBe true
  }
  it should "have the contractAcceptanceDate set to the first delivery date" in {
    nonGift.subscription.contractAcceptanceDate shouldBe firstDeliveryDate
  }

  it should "have the contractEffectiveDate and the termStartDate set to the date it was sold" in {
    nonGift.subscription.contractEffectiveDate shouldBe saleDate
    nonGift.subscription.termStartDate shouldBe saleDate
  }

  it should "have an initial term of 12 months" in {
    nonGift.subscription.initialTerm shouldBe 12
    nonGift.subscription.initialTermPeriodType shouldBe Month
  }

  it should "have the correct productRatePlanId" in {
    nonGift.ratePlanData.head.ratePlan.productRatePlanId shouldBe "2c92c0f965dc30640165f150c0956859"
  }

  it should "have set csrUsername and salesforceCaseId" in {
    csrSubscription.subscription.acquisitionSource shouldBe Some(CSR)
    csrSubscription.subscription.createdByCsr shouldBe Some("Dan Csr")
    csrSubscription.subscription.acquisitionCase shouldBe Some("test_case_id")
  }

  it should "have the Direct readerType when given random promo" in {
    val aPromotion = mock[Promotion]
    val pwc = PromotionWithCode("NOTAPATRONPROMO", aPromotion)

    when(promotionService.findPromotion(ArgumentMatchers.eq("NOTAPATRONPROMO"))).thenReturn(Right(pwc))

    when(
      promotionService.applyPromotion(
        ArgumentMatchers.eq(pwc),
        ArgumentMatchers.eq(UK),
        ArgumentMatchers.eq("2c92c0f965dc30640165f150c0956859"),
        any(),
        ArgumentMatchers.eq(false),
      ),
    ).thenAnswer { i =>
      {
        val sd = i.getArgument[SubscriptionData](3)
        val patchedSubscription = sd.subscription.copy(promoCode = Some(pwc.promoCode))
        Right(sd.copy(subscription = patchedSubscription))
      }
    }

    nonGiftPromo.subscription.readerType shouldBe Direct
  }

  it should "have the Patron readerType when given Patron promo" in {
    val aPromotion = mock[Promotion]
    val pwc = PromotionWithCode("FOOPATRON", aPromotion)

    when(promotionService.findPromotion(ArgumentMatchers.eq("FOOPATRON"))).thenReturn(Right(pwc))

    when(
      promotionService.applyPromotion(
        ArgumentMatchers.eq(pwc),
        ArgumentMatchers.eq(UK),
        ArgumentMatchers.eq("2c92c0f965dc30640165f150c0956859"),
        any(),
        ArgumentMatchers.eq(false),
      ),
    ).thenAnswer { i =>
      {
        val sd = i.getArgument[SubscriptionData](3)
        val patchedSubscription = sd.subscription.copy(promoCode = Some(pwc.promoCode))
        Right(sd.copy(subscription = patchedSubscription))
      }
    }

    nonGiftPatron.subscription.readerType shouldBe Patron
  }

  val requestId = UUID.fromString("f7651338-5d94-4f57-85fd-262030de9ad5")
  val user = User(
    "1234",
    "hi@thegulocal.com",
    None,
    "bob",
    "smith",
    Address(None, None, None, None, None, Country.UK),
    Some(Address(None, None, None, None, None, Country.UK)),
  )
  lazy val product = GuardianWeekly(GBP, Quarterly, Domestic)
  lazy val promotionService = mock[PromotionService]
  lazy val saleDate = new LocalDate(2019, 10, 24)
  lazy val firstDeliveryDate = saleDate.plusDays(3)
  val salesforceContactRecords = SalesforceContactRecords(SalesforceContactRecord("", ""), None)
  lazy val state = CreateZuoraSubscriptionState(
    requestId = requestId,
    user = user,
    giftRecipient = None,
    product = product,
    paymentMethod = PayPalReferenceTransaction("baid", "hi@thegulocal.com"),
    analyticsInfo = AnalyticsInfo(false, PayPal),
    firstDeliveryDate = Some(firstDeliveryDate),
    appliedPromotion = None,
    csrUsername = None,
    salesforceCaseId = None,
    acquisitionData = None,
    salesforceContacts = salesforceContactRecords,
  )

  lazy val subscribeItemBuilder = new SubscribeItemBuilder(
    requestId,
    user,
    GBP,
  )

  lazy val gift: SubscriptionData = new GuardianWeeklySubscriptionBuilder(
    promotionService,
    CODE,
    DateGenerator(saleDate),
    subscribeItemBuilder,
  ).build(
    product,
    state.copy(giftRecipient = Some(GiftRecipient(None, "bob", "smith", None))),
  ).toOption
    .get
    .subscriptionData

  lazy val nonGift = new GuardianWeeklySubscriptionBuilder(
    promotionService,
    CODE,
    DateGenerator(saleDate),
    subscribeItemBuilder,
  ).build(
    product,
    state,
  ).toOption
    .get
    .subscriptionData

  lazy val csrSubscription = new GuardianWeeklySubscriptionBuilder(
    promotionService,
    CODE,
    DateGenerator(saleDate),
    subscribeItemBuilder,
  ).build(
    product,
    state.copy(
      csrUsername = Some("Dan Csr"),
      salesforceCaseId = Some("test_case_id"),
    ),
  ).toOption
    .get
    .subscriptionData

  lazy val nonGiftPatron = new GuardianWeeklySubscriptionBuilder(
    promotionService,
    CODE,
    DateGenerator(saleDate),
    subscribeItemBuilder,
  ).build(
    product,
    state.copy(appliedPromotion = Some(AppliedPromotion("FOOPATRON", "uk"))),
  ).toOption
    .get
    .subscriptionData

  lazy val nonGiftPromo = new GuardianWeeklySubscriptionBuilder(
    promotionService,
    CODE,
    DateGenerator(saleDate),
    subscribeItemBuilder,
  ).build(
    product,
    state.copy(appliedPromotion = Some(AppliedPromotion("NOTAPATRONPROMO", "uk"))),
  ).toOption
    .get
    .subscriptionData
}
