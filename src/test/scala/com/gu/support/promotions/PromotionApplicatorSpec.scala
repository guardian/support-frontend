package com.gu.support.promotions

import com.gu.support.config.PromotionsDiscountConfig
import com.gu.support.promotions.Fixtures._
import org.scalatest.{FlatSpec, Matchers}

class PromotionApplicatorSpec extends FlatSpec with Matchers {
  val config = PromotionsDiscountConfig(validProductRatePlanId, "112233")
  val correctDate = subscriptionData.subscription.contractEffectiveDate.plusDays(freeTrial.freeTrial.get.duration.getDays)

  "PromotionApplicator" should "add a discount rate plan" in {
    val result = PromotionApplicator(validDiscount, config)
      .applyTo(subscriptionData)

    result.ratePlanData.length shouldBe 2
    result.subscription.promoCode shouldBe Some(discountPromoCode)
  }

  it should "apply a free trial" in {
    val result = PromotionApplicator(validFreeTrial, config)
      .applyTo(subscriptionData)

    result.subscription.contractEffectiveDate shouldBe correctDate
    result.subscription.promoCode shouldBe Some(freeTrialPromoCode)
  }

  it should "apply both benefits of a double promotion" in {
    val result = PromotionApplicator(validDouble, config)
      .applyTo(subscriptionData)

    result.subscription.contractEffectiveDate shouldBe correctDate
    result.subscription.promoCode shouldBe Some(doublePromoCode)
    result.ratePlanData.length shouldBe 2
  }
}
