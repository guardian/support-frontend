package com.gu.support.promotions

import com.gu.support.catalog._
import com.gu.support.config.TouchPointEnvironments
import com.gu.support.config.TouchPointEnvironments.PROD
import com.gu.support.workers.Annual
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import com.gu.support.zuora.api.{RatePlan, RatePlanData, Subscription, SubscriptionData}
import org.joda.time.{DateTime, Days, LocalDate, Months}
import com.gu.support.catalog.ProductRatePlanId

/** Promotions are quite laborious to construct So these are helper methods for unit tests
  */
object ServicesFixtures {

  val freeTrialPromoCode = "FREE_TRIAL_CODE"
  val discountPromoCode = "DISCOUNT_CODE"
  val doublePromoCode = "DOUBLE_CODE"
  val invalidPromoCode = "INVALID_CODE"
  val renewalPromoCode = "RENEWAL_CODE"
  val trackingPromoCode = "TRACKING_CODE"
  val duplicatedPromoCode = "DUPLICATED_CODE"
  val tenAnnual = "10ANNUAL"
  val sixForSix = "6FOR6"

  val validProductRatePlanIds: List[ProductRatePlanId] = Product.allProducts.flatMap(_.ratePlans(PROD).map(_.id))
  val validProductRatePlanId = validProductRatePlanIds.head
  val secondValidProductRatePlanId = validProductRatePlanIds.tail.head
  val invalidProductRatePlanId = "67890"

  val freeTrialBenefit: Some[FreeTrialBenefit] = Some(FreeTrialBenefit(Days.days(5)))
  val discountBenefit: Some[DiscountBenefit] = Some(DiscountBenefit(30, Some(Months.months(3))))

  val freeTrial = promotion(validProductRatePlanIds, freeTrialPromoCode, freeTrial = freeTrialBenefit)
  val freeTrialWithCode: PromotionWithCode = PromotionWithCode(freeTrialPromoCode, freeTrial)
  val discount = promotion(validProductRatePlanIds, discountPromoCode, discountBenefit)
  val discountWithCode: PromotionWithCode = PromotionWithCode(discountPromoCode, discount)
  val double = promotion(validProductRatePlanIds, doublePromoCode, discountBenefit, freeTrialBenefit)
  val doubleWithCode: PromotionWithCode = PromotionWithCode(doublePromoCode, double)
  val tracking: PromotionWithCode =
    PromotionWithCode(trackingPromoCode, promotion(validProductRatePlanIds, trackingPromoCode, tracking = true))
  val renewal: PromotionWithCode = PromotionWithCode(
    renewalPromoCode,
    promotion(validProductRatePlanIds, renewalPromoCode, discountBenefit, renewal = true),
  )
  val guardianWeeklyAnnual = promotion(
    GuardianWeekly
      .getProductRatePlans(TouchPointEnvironments.PROD)
      .filter(ratePlan => ratePlan.billingPeriod == Annual && ratePlan.readerType == Direct)
      .map(_.id),
    tenAnnual,
    Some(DiscountBenefit(10, Some(Months.TWELVE))),
  )
  val guardianWeeklyAnnualGift = guardianWeeklyAnnual.copy(
    appliesTo = AppliesTo.ukOnly(
      GuardianWeekly
        .getProductRatePlans(TouchPointEnvironments.PROD)
        .filter(ratePlan => ratePlan.billingPeriod == Annual && ratePlan.readerType == Gift)
        .map(_.id)
        .toSet,
    ),
  )
  val guardianWeeklyWithCode: PromotionWithCode = PromotionWithCode(tenAnnual, guardianWeeklyAnnual)
  val duplicate1 = promotion(validProductRatePlanIds, duplicatedPromoCode, discountBenefit)
  val duplicate2 = promotion(validProductRatePlanIds, duplicatedPromoCode, freeTrial = freeTrialBenefit)

  val now: LocalDate = LocalDate.now()
  val subscriptionData: SubscriptionData = SubscriptionData(
    List(
      RatePlanData(RatePlan(validProductRatePlanId), Nil, Nil),
    ),
    Subscription(now, now, now, "id123"),
  )

  def promotion(
      ids: List[ProductRatePlanId] = validProductRatePlanIds,
      code: PromoCode = freeTrialPromoCode,
      discount: Option[DiscountBenefit] = None,
      freeTrial: Option[FreeTrialBenefit] = None,
      renewal: Boolean = false,
      tracking: Boolean = false,
      starts: DateTime = DateTime.now().withTimeAtStartOfDay().minusDays(1),
      expires: DateTime = DateTime.now().withTimeAtStartOfDay().plusDays(1),
  ): Promotion = {
    Promotion(
      name = "Test promotion",
      description = s"$code description",
      appliesTo = AppliesTo.ukOnly(ids.toSet),
      campaignCode = "C",
      channelCodes = Map("testChannel" -> Set(code)),
      starts = starts,
      expires = Some(expires),
      discount = discount,
      freeTrial = freeTrial,
      tracking = tracking,
      renewalOnly = renewal,
    )
  }
}
