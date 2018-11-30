package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.config.{PromotionsConfigProvider, Stages}
import com.gu.support.promotions.Fixtures.{freeTrialPromoCode, _}
import com.typesafe.config.ConfigFactory
import org.scalatest.{FlatSpec, Matchers}
import Fixtures._

class PromotionServiceSpec extends FlatSpec with Matchers {

  val service = new PromotionService(
    new PromotionsConfigProvider(ConfigFactory.load(), Stages.DEV).get(),
    Some(new SimplePromotionCollection(List(freeTrial, discount, tracking, renewal)))
  )

  "PromotionService" should "find a PromoCode" in {
    service.findPromotion(freeTrialPromoCode) should be(Some(freeTrial))
  }

  it should "validate a PromoCode" in {
    service.validatePromoCode(freeTrialPromoCode, Country.UK, validProductRatePlanId, false) should be(Right(freeTrial))
    service.validatePromoCode(invalidPromoCode, Country.UK, validProductRatePlanId, false) should be(Left(NoSuchCode))
    service.validatePromoCode(freeTrialPromoCode, Country.UK, invalidProductRatePlanId, false) should be(Left(InvalidProductRatePlan))
    service.validatePromoCode(freeTrialPromoCode, Country.US, validProductRatePlanId, false) should be(Left(InvalidCountry))
    service.validatePromoCode(renewalPromoCode, Country.UK, validProductRatePlanId, false) should be(Left(NotApplicable))
  }

  it should "apply a discount PromoCode" in {
    val result = service.applyPromotion(discountPromoCode, Country.UK, validProductRatePlanId, subscriptionData, false)
    result.isRight shouldBe true
    result.right.get.ratePlanData.length shouldBe 2
  }

  it should "not apply an invalid PromoCode" in {
    service.applyPromotion(invalidPromoCode, Country.UK, validProductRatePlanId, subscriptionData, false) shouldBe Left(NoSuchCode)
  }

  it should "find all discounts" in {
    service.discountPromotions.length shouldBe 1
  }
}
