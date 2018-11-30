package com.gu.support.promotions

import com.gu.promotions.PromotionApplicator
import com.gu.support.config.PromotionsDiscountConfig
import com.gu.support.promotions.Fixtures._
import org.scalatest.{FlatSpec, Matchers}

class PromotionApplicatorSpec extends FlatSpec with Matchers {
  "DiscountApplicator" should "add a discount rate plan" in {
    val config = PromotionsDiscountConfig(validProductRatePlanId, "112233")
    val subscriptionDataWithPromotion = PromotionApplicator(discount, config).applyTo(subscriptionData)
    subscriptionDataWithPromotion.ratePlanData.length shouldBe 2
  }
}
