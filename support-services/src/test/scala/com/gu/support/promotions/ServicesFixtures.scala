package com.gu.support.promotions

import com.gu.support.catalog.{DigitalPack, ProductRatePlanId}
import com.gu.support.zuora.api.{RatePlan, RatePlanData, Subscription, SubscriptionData}
import org.joda.time.{DateTime, Days, LocalDate, Months}

/**
 * Promotions are quite laborious to construct
 * So these are helper methods for unit tests
 */
object ServicesFixtures {

  val freeTrialPromoCode = "FREE_TRIAL_CODE"
  val discountPromoCode = "DISCOUNT_CODE"
  val doublePromoCode = "DOUBLE_CODE"
  val invalidPromoCode = "INVALID_CODE"
  val renewalPromoCode = "RENEWAL_CODE"
  val trackingPromoCode = "TRACKING_CODE"
  val digitalPackProductRatePlanIds = DigitalPack.ratePlans.map(_.id)
  val validProductRatePlanId = digitalPackProductRatePlanIds.head
  val invalidProductRatePlanId = "67890"

  val freeTrialBenefit = Some(FreeTrialBenefit(Days.days(5)))
  val discountBenefit = Some(DiscountBenefit(30, Some(Months.months(3))))

  val freeTrial = promotion(digitalPackProductRatePlanIds, freeTrialPromoCode, freeTrial = freeTrialBenefit)
  val validFreeTrial = ValidatedPromotion(freeTrialPromoCode, freeTrial)
  val discount = promotion(digitalPackProductRatePlanIds, discountPromoCode, discountBenefit)
  val validDiscount = ValidatedPromotion(discountPromoCode, discount)
  val double = promotion(digitalPackProductRatePlanIds, doublePromoCode, discountBenefit, freeTrialBenefit)
  val validDouble = ValidatedPromotion(doublePromoCode, double)
  val tracking = promotion(digitalPackProductRatePlanIds, trackingPromoCode, tracking = true)
  val renewal = promotion(digitalPackProductRatePlanIds, renewalPromoCode, discountBenefit, renewal = true)

  val now = LocalDate.now()
  val subscriptionData = SubscriptionData(
    List(
      RatePlanData(RatePlan(validProductRatePlanId), Nil, Nil)
    ),
    Subscription(now, now, now)
  )

  def promotion(
    ids: List[ProductRatePlanId] = digitalPackProductRatePlanIds,
    code: PromoCode = freeTrialPromoCode,
    discount: Option[DiscountBenefit] = None,
    freeTrial: Option[FreeTrialBenefit] = None,
    renewal: Boolean = false,
    tracking: Boolean = false,
    starts: DateTime = DateTime.now().withTimeAtStartOfDay().minusDays(1),
    expires: DateTime = DateTime.now().withTimeAtStartOfDay().plusDays(1)
  ): Promotion = {
    Promotion(
      name = "Test promotion",
      description = s"$freeTrialPromoCode description",
      appliesTo = AppliesTo.ukOnly(ids.toSet),
      campaignCode = "C",
      channelCodes = Map("testChannel" -> Set(code)),
      starts = starts,
      expires = Some(expires),
      discount = discount,
      freeTrial = freeTrial,
      tracking = tracking,
      renewalOnly = renewal
    )
  }
}

