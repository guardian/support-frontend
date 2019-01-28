package com.gu.support.promotions

import com.gu.i18n.Country.UK
import com.gu.support.promotions.PromotionServiceSpec.serviceWithDynamo
import com.gu.support.promotions.ServicesFixtures.subscriptionData
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.{FlatSpec, Matchers}

@IntegrationTest
class PromotionServiceIntegrationSpec extends FlatSpec with Matchers {
  "PromotionService" should "apply a real promo code" in {
    val realPromoCode = "DJP8L27FY"
    val digipackMonthlyProductRatePlanId = "2c92c0f84bbfec8b014bc655f4852d9d"
    val result = serviceWithDynamo.applyPromotion(realPromoCode, UK, digipackMonthlyProductRatePlanId, subscriptionData, isRenewal = false)
    result.ratePlanData.length shouldBe 2
  }

  it should "find a promotion" in {
    val promotion = serviceWithDynamo.findPromotion("DISC503")
    promotion.isDefined shouldBe true
  }
}
