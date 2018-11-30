package com.gu.support.promotions

import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.zuora.api.{RatePlan, RatePlanData, Subscription, SubscriptionData}
import org.joda.time.{DateTime, Days, LocalDate, Months}

/**
 * Promotions are quite laborious to construct
 * So these are helper methods for unit tests
 */
object Fixtures {

  val freeTrialPromoCode = "FREE_TRIAL_CODE"
  val discountPromoCode = "DISCOUNT_CODE"
  val invalidPromoCode = "INVALID_CODE"
  val renewalPromoCode = "RENEWAL_CODE"
  val validProductRatePlanId = "12345"
  val invalidProductRatePlanId = "67890"
  val prpIds = List(validProductRatePlanId)
  val freeTrial = promotion(prpIds, freeTrialPromoCode, freeTrial = Some(FreeTrialBenefit(Days.days(5))))
  val discount = promotion(prpIds, discountPromoCode, discount = Some(DiscountBenefit(30, Some(Months.months(3)))))
  val tracking = promotion(prpIds, tracking = true)
  val renewal = promotion(prpIds, renewalPromoCode, renewal = true)
  val now = LocalDate.now()
  val subscriptionData = SubscriptionData(
    List(
      RatePlanData(RatePlan(validProductRatePlanId), Nil, Nil)
    ),
    Subscription(now, now, now)
  )

  def promotion(
    ids: List[ProductRatePlanId] = prpIds,
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

