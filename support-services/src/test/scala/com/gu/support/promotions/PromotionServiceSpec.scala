package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.i18n.CountryGroup.{UK, US}
import com.gu.support.catalog.GuardianWeekly
import com.gu.support.config.{PromotionsConfigProvider, Stages}
import com.gu.support.promotions.PromotionServiceSpec._
import com.gu.support.promotions.ServicesFixtures.{freeTrialPromoCode, _}
import com.typesafe.config.ConfigFactory
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

//noinspection NameBooleanParameters
class PromotionServiceSpec extends AsyncFlatSpec with Matchers {

  "PromotionService" should "find a PromoCode" in {
    serviceWithFixtures.findPromotion(freeTrialPromoCode) should be(Right(freeTrialWithCode))
    serviceWithFixtures.findPromotion(invalidPromoCode) should be(Left(NoSuchCode))
    serviceWithFixtures
      .findPromotion(duplicatedPromoCode)
      .left
      .map({
        case code: DuplicateCode => code.copy(debug = "")
        case _ => fail()
      }) should be(
      Left(DuplicateCode("")),
    )
  }

  it should "find multiple promo codes, in correct order" in {
    val promotions =
      serviceWithFixtures.findPromotions(
        List(freeTrialPromoCode, tenAnnual),
      )
    promotions should equal(List(freeTrialWithCode, guardianWeeklyWithCode))
  }

  it should "handle Nil in findPromotions" in {
    val promotions = serviceWithFixtures.findPromotions(Nil)
    promotions shouldBe Nil
  }

  it should "find all the Guardian Weekly promotions" in {
    val promotions =
      serviceWithFixtures.findPromotions(
        List(
          tenAnnual,
        ),
      )
    promotions.length shouldBe 1
  }

  it should "validate a PromoCode" in {
    serviceWithFixtures.validatePromotion(
      freeTrialWithCode,
      UK,
      validProductRatePlanId,
      false,
    ) should be(Right(PromotionWithCode(freeTrialPromoCode, freeTrial)))
    serviceWithFixtures.validatePromotion(freeTrialWithCode, UK, invalidProductRatePlanId, false) should be(
      Left(InvalidProductRatePlan),
    )
    serviceWithFixtures.validatePromotion(freeTrialWithCode, US, validProductRatePlanId, false) should be(
      Left(InvalidCountryGroup),
    )
    serviceWithFixtures.validatePromotion(renewal, UK, validProductRatePlanId, false) should be(Left(NotApplicable))
  }

  it should "apply a discount PromoCode" in {
    val result = serviceWithFixtures
      .applyPromotion(discountWithCode, UK, validProductRatePlanId, subscriptionData, false)
      .right
      .get
    result.ratePlanData.length shouldBe 2
    result.subscription.promoCode shouldBe Some(discountPromoCode)
  }

  it should "apply a FreeTrial PromoCode" in {
    val result = serviceWithFixtures
      .applyPromotion(freeTrialWithCode, UK, validProductRatePlanId, subscriptionData, false)
      .right
      .get
    result.subscription.contractAcceptanceDate shouldBe subscriptionData.subscription.contractAcceptanceDate.plusDays(
      freeTrialBenefit.get.duration.getDays,
    )
    result.subscription.promoCode shouldBe Some(freeTrialPromoCode)
  }

  it should "apply a double PromoCode" in {
    val result =
      serviceWithFixtures.applyPromotion(doubleWithCode, UK, validProductRatePlanId, subscriptionData, false).right.get
    result.subscription.contractAcceptanceDate shouldBe subscriptionData.subscription.contractAcceptanceDate.plusDays(
      freeTrialBenefit.get.duration.getDays,
    )
    result.ratePlanData.length shouldBe 2
    result.subscription.promoCode shouldBe Some(doublePromoCode)
  }

  it should "add any valid promo code to the subscription data" in {
    serviceWithFixtures
      .applyPromotion(tracking, UK, validProductRatePlanId, subscriptionData, false)
      .right
      .get
      .subscription
      .promoCode shouldBe Some(trackingPromoCode)
  }

  it should "not apply a renewal code to a new subscription" in {
    serviceWithFixtures.applyPromotion(renewal, UK, validProductRatePlanId, subscriptionData, false) shouldBe Left(
      NotApplicable,
    )
  }

  it should "not apply a non renewal code to a renewal" in {
    serviceWithFixtures.applyPromotion(
      discountWithCode,
      UK,
      validProductRatePlanId,
      subscriptionData,
      true,
    ) shouldBe Left(NotApplicable)
  }

  it should "apply a renewal code to a renewal" in {
    val result =
      serviceWithFixtures.applyPromotion(renewal, UK, validProductRatePlanId, subscriptionData, true).right.get
    result.ratePlanData.length shouldBe 2
    result.subscription.promoCode shouldBe Some(renewalPromoCode)
  }
}

object PromotionServiceSpec {
  val config = new PromotionsConfigProvider(ConfigFactory.load(), Stages.DEV).get()
  val serviceWithFixtures = new PromotionService(
    config,
    Some(
      new SimplePromotionCollection(
        List(
          discount,
          double,
          tracking.promotion,
          renewal.promotion,
          guardianWeeklyAnnual,
          freeTrial,
          duplicate1,
          duplicate2,
        ),
      ),
    ),
  )

  val serviceWithDynamo = new PromotionService(
    config,
    None,
  )
}
