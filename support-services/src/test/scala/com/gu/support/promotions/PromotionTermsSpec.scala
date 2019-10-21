package com.gu.support.promotions

import com.gu.support.catalog.GuardianWeekly
import com.gu.support.config.Stages.PROD
import com.gu.support.promotions.ServicesFixtures.guardianWeeklyAnnual
import org.scalatest.{FlatSpec, Matchers}

class PromotionTermsSpec extends FlatSpec with Matchers {
  "PromotionTerms object" should "be able to extract the promotion terms from a Promotion" in {
    val promotionTerms = PromotionTerms
      .promotionTermsFromPromotion(PROD)(PromotionWithCode(GuardianWeekly.AnnualPromoCode, guardianWeeklyAnnual))
    promotionTerms.productRatePlans.length shouldBe (6)
  }
}
