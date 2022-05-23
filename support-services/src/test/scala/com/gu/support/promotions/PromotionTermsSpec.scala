package com.gu.support.promotions

import com.gu.support.catalog.GuardianWeekly
import com.gu.support.config.Stages.PROD
import com.gu.support.promotions.ServicesFixtures.{guardianWeeklyAnnual, guardianWeeklyAnnualGift, tenAnnual}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class PromotionTermsSpec extends AsyncFlatSpec with Matchers {
  "PromotionTerms object" should "be able to extract the promotion terms from a Promotion" in {
    val promotionTerms = PromotionTerms
      .promotionTermsFromPromotion(PROD)(
        PromotionWithCode(tenAnnual, guardianWeeklyAnnual),
      )
    promotionTerms.productRatePlans.length shouldBe 2
  }

  it should "be able to extract the promotion terms for a gift" in {
    val promotionTerms = PromotionTerms
      .promotionTermsFromPromotion(PROD)(PromotionWithCode("ANY_CODE", guardianWeeklyAnnualGift))
    promotionTerms.productRatePlans.length shouldBe 2
  }
}
