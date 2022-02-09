package com.gu.support.promotions

import com.gu.i18n.Country.UK
import com.gu.support.promotions.PromotionServiceSpec.serviceWithDynamo
import com.gu.support.promotions.ServicesFixtures.subscriptionData
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class PromotionServiceIntegrationSpec extends AsyncFlatSpec with Matchers {
  "PromotionService" should "apply a real promo code" in {
    val realPromoCode = "DJP8L27FY"
    val digipackMonthlyProductRatePlanId = "2c92c0f84bbfec8b014bc655f4852d9d"
    val promotionWithCode = serviceWithDynamo.findPromotion(realPromoCode).right.get
    val result = serviceWithDynamo
      .applyPromotion(promotionWithCode, UK, digipackMonthlyProductRatePlanId, subscriptionData, isRenewal = false)
      .right
      .get
    result.ratePlanData.length shouldBe 2
  }

  it should "find a promotion" in {
    val promotion = serviceWithDynamo.findPromotion("DK0NT24WG")
    promotion.isRight shouldBe true
  }
}
