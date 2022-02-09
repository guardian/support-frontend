package com.gu.support.promotions

import com.gu.i18n.Country.{UK, US}
import com.gu.support.promotions.PromotionValidator.PromotionExtensions
import com.gu.support.promotions.ServicesFixtures.{promotion, _}
import org.joda.time.DateTime
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

//noinspection NameBooleanParameters
class PromotionValidatorSpec extends AsyncFlatSpec with Matchers {
  val NoErrors = Nil

  val thisMorning = DateTime.now().withTimeAtStartOfDay()
  val tomorrowMorning = thisMorning.plusDays(1)
  val expiredPromotion = promotion(expires = thisMorning)
  val activePromotion = promotion()
  val futurePromotion = promotion(starts = tomorrowMorning, expires = tomorrowMorning.plusDays(1))

  val providedStarts = futurePromotion.starts
  val providedExpires = futurePromotion.expires.get

  "PromotionValidator" should "validate correctly" in {

    // check invalid exceptions take precedence over time/status-based exceptions
    expiredPromotion.validateFor(invalidProductRatePlanId, UK, false) should contain(InvalidProductRatePlan)
    expiredPromotion.validateFor(validProductRatePlanId, US, false) should contain(InvalidCountry)
    activePromotion.validateFor(invalidProductRatePlanId, UK, false) should contain(InvalidProductRatePlan)
    activePromotion.validateFor(validProductRatePlanId, US, false) should contain(InvalidCountry)
    futurePromotion.validateFor(invalidProductRatePlanId, UK, false) should contain(InvalidProductRatePlan)
    futurePromotion.validateFor(validProductRatePlanId, US, false) should contain(InvalidCountry)

    // check valid promotions adhere to their time/status.
    expiredPromotion.validateFor(validProductRatePlanId, UK, false).head shouldBe ExpiredPromotion
    activePromotion.validateFor(validProductRatePlanId, UK, false) shouldBe NoErrors
    futurePromotion.validateFor(validProductRatePlanId, UK, false).head shouldBe PromotionNotActiveYet

    // check start date comparison is inclusive to the millisecond, and expires is exclusive to the millisecond
    // (tested via the provided 'now' overrride)
    futurePromotion
      .validateFor(validProductRatePlanId, UK, false, providedStarts.minusMillis(1))
      .head shouldBe PromotionNotActiveYet
    futurePromotion.validateFor(validProductRatePlanId, UK, false, providedExpires).head shouldBe ExpiredPromotion
    futurePromotion.validateFor(validProductRatePlanId, UK, false, providedStarts) shouldBe NoErrors
    futurePromotion.validateFor(validProductRatePlanId, UK, false, providedExpires.minusMillis(1)) shouldBe NoErrors

    // check Tracking promotions don't check against the rate plan InvalidProductRatePlan
    activePromotion.copy(tracking = true).validateFor(invalidProductRatePlanId, UK, false) shouldBe NoErrors
    activePromotion.copy(tracking = true).validateFor(validProductRatePlanId, UK, false) shouldBe NoErrors
    expiredPromotion.copy(tracking = true).validateFor(invalidProductRatePlanId, US, false).head shouldBe InvalidCountry

    // Check a promotion can validate against a list of productRatePlans
    activePromotion
      .validForAnyProductRatePlan(List(invalidProductRatePlanId, validProductRatePlanId), UK, false)
      .length shouldBe 1
    activePromotion
      .validForAnyProductRatePlan(List(secondValidProductRatePlanId, validProductRatePlanId), UK, false)
      .length shouldBe 2
    activePromotion.validForAnyProductRatePlan(List(invalidProductRatePlanId), UK, false).length shouldBe 0
  }

  it should "handle renewal promotions correctly" in {
    // check Renewal promotions check against the rate plan InvalidProductRatePlan
    activePromotion
      .copy(renewalOnly = true)
      .validateFor(invalidProductRatePlanId, UK, true)
      .head shouldBe InvalidProductRatePlan
    expiredPromotion.copy(renewalOnly = true).validateFor(validProductRatePlanId, US, true).head shouldBe InvalidCountry

    // check Renewal promotions are invalid for new subscriptions and vice versa
    activePromotion.copy(renewalOnly = true).validateFor(validProductRatePlanId, UK, false).head shouldBe NotApplicable
    activePromotion.copy(renewalOnly = false).validateFor(validProductRatePlanId, UK, true).head shouldBe NotApplicable

    activePromotion.copy(renewalOnly = true).validateFor(validProductRatePlanId, UK, true) shouldBe NoErrors
  }
}
