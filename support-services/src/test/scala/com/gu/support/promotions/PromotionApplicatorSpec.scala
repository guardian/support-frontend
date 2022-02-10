package com.gu.support.promotions

import com.gu.support.config.PromotionsDiscountConfig
import com.gu.support.promotions.ServicesFixtures._
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class PromotionApplicatorSpec extends AsyncFlatSpec with Matchers {
  val config = PromotionsDiscountConfig(validProductRatePlanId, "112233")
  val correctDate =
    subscriptionData.subscription.contractEffectiveDate.plusDays(freeTrial.freeTrial.get.duration.getDays)

  "PromotionApplicator" should "add a discount rate plan" in {
    val result = PromotionApplicator(discountWithCode, config)
      .applyTo(subscriptionData)

    result.ratePlanData.length shouldBe 2
    result.subscription.promoCode shouldBe Some(discountPromoCode)
  }

  it should "apply a free trial" in {
    val result = PromotionApplicator(freeTrialWithCode, config)
      .applyTo(subscriptionData)

    result.subscription.contractAcceptanceDate shouldBe correctDate
    result.subscription.promoCode shouldBe Some(freeTrialPromoCode)
  }

  it should "apply both benefits of a double promotion" in {
    val result = PromotionApplicator(doubleWithCode, config)
      .applyTo(subscriptionData)

    result.subscription.contractAcceptanceDate shouldBe correctDate
    result.subscription.promoCode shouldBe Some(doublePromoCode)
    result.ratePlanData.length shouldBe 2
  }
}
