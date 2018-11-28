package com.gu.support.promotions

import com.gu.i18n.Country
import org.joda.time.Days
import org.scalatest.{FlatSpec, Matchers}

class PromotionServiceSpec extends FlatSpec with Matchers {

  val code = "VALID_CODE"
  val prpId = "12345"
  val promotion = Fixtures.promoFor(code, FreeTrial(Days.days(5)), prpId)
  val service = new PromotionService(new SimplePromotionCollection(List(promotion)))

  "PromotionService" should "find a PromoCode" in {
    service.findPromotion(code) should be(Some(promotion))
  }

  it should "validate a PromoCode" in {
    service.validatePromotion(code, Country.UK, prpId) should be(Right(promotion))
    service.validatePromotion("INVALID_CODE", Country.UK, prpId) should be(Left(NoSuchCode))
    service.validatePromotion(code, Country.UK, "67890") should be(Left(InvalidProductRatePlan))
    service.validatePromotion(code, Country.US, prpId) should be(Left(InvalidCountry))
  }
}
