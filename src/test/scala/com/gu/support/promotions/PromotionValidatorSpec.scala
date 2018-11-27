package com.gu.support.promotions

import com.gu.i18n.Country.{UK, US}
import com.gu.support.config.Stages.DEV
import com.gu.support.config.ZuoraConfigProvider
import com.gu.support.promotions.Fixtures.promoFor
import com.typesafe.config.ConfigFactory
import org.joda.time.{DateTime, Days}
import org.scalatest.FlatSpec
import org.scalatest.Matchers._
import com.gu.support.promotions.PromotionValidator.PromotionExtensions

class PromotionValidatorSpec extends FlatSpec {
  val NoErrors = Nil
  val config = new ZuoraConfigProvider(ConfigFactory.load(), DEV).get()
  val productRatePlanIds = config.digitalPack.productRatePlans

  def generatePromotion(starts: DateTime, expires: DateTime) =
    promoFor("TEST01", FreeTrial(Days.days(5)), productRatePlanIds.monthly, productRatePlanIds.annual, productRatePlanIds.quarterly)
      .copy(starts = starts, expires = Some(expires))

  val thisMorning = DateTime.now.withTimeAtStartOfDay()
  val yesterdayMorning = thisMorning.minusDays(1)
  val tomorrowMorning = thisMorning.plusDays(1)

  val expiredPromotion = generatePromotion(yesterdayMorning, thisMorning)
  val activePromotion = generatePromotion(yesterdayMorning, tomorrowMorning)
  val futurePromotion = generatePromotion(tomorrowMorning, tomorrowMorning.plusDays(1))

  val yearlyRatePlan = productRatePlanIds.annual
  val invalidRatePlan = "invalid-id"
  val providedStarts = futurePromotion.starts
  val providedExpires = futurePromotion.expires.get

  "PromotionValidator" should "validate correctly" in {

    // check invalid exceptions take precedence over time/status-based exceptions
    expiredPromotion.validateFor(invalidRatePlan, UK) should contain(InvalidProductRatePlan)
    expiredPromotion.validateFor(yearlyRatePlan, US) should contain(InvalidCountry)
    activePromotion.validateFor(invalidRatePlan, UK) should contain(InvalidProductRatePlan)
    activePromotion.validateFor(yearlyRatePlan, US) should contain(InvalidCountry)
    futurePromotion.validateFor(invalidRatePlan, UK) should contain(InvalidProductRatePlan)
    futurePromotion.validateFor(yearlyRatePlan, US) should contain(InvalidCountry)

    // check valid promotions adhere to their time/status.
    expiredPromotion.validateFor(yearlyRatePlan, UK).head should be(ExpiredPromotion)
    activePromotion.validateFor(yearlyRatePlan, UK) should be(NoErrors)
    futurePromotion.validateFor(yearlyRatePlan, UK).head should be(PromotionNotActiveYet)

    // check start date comparison is inclusive to the millisecond, and expires is exclusive to the millisecond
    // (tested via the provided 'now' overrride)

    futurePromotion.validateFor(yearlyRatePlan, UK, providedStarts.minusMillis(1)).head should be(PromotionNotActiveYet)
    futurePromotion.validateFor(yearlyRatePlan, UK, providedExpires).head should be(ExpiredPromotion)
    futurePromotion.validateFor(yearlyRatePlan, UK, providedStarts) should be(NoErrors)
    futurePromotion.validateFor(yearlyRatePlan, UK, providedExpires.minusMillis(1)) should be(NoErrors)

    // check Tracking promotions don't check against the rate plan InvalidProductRatePlan
    activePromotion.copy(promotionType = Tracking).validateFor(invalidRatePlan, UK) should be(NoErrors)
    activePromotion.copy(promotionType = Tracking).validateFor(yearlyRatePlan, UK) should be(NoErrors)
    expiredPromotion.copy(promotionType = Tracking).validateFor(invalidRatePlan, US).head should be(InvalidCountry)

    // check Renewal promotions check against the rate plan InvalidProductRatePlan
    activePromotion.copy(promotionType = Renewal).validateFor(invalidRatePlan, UK).head should be(InvalidProductRatePlan)
    expiredPromotion.copy(promotionType = Renewal).validateFor(yearlyRatePlan, US).head should be(InvalidCountry)
  }
}
