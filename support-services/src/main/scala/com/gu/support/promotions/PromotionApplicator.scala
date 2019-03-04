package com.gu.support.promotions

import com.gu.support.config.PromotionsDiscountConfig
import com.gu.support.zuora.api._
import com.typesafe.scalalogging.LazyLogging

class PromotionApplicator(validPromotion: ValidatedPromotion, config: PromotionsDiscountConfig) {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData = {

    val benefitApplicators = List(
      validPromotion.promotion.freeTrial.map(new FreeTrialApplicator(_)),
      validPromotion.promotion.discount.map(new DiscountApplicator(_, config)),
      validPromotion.promotion.incentive.map(new IncentiveApplicator(_))
    ).flatten

    val withBenefits = benefitApplicators
      .foldLeft(subscriptionData) { case (currentData, applicator) => applicator.applyTo(currentData) }

    withBenefits.copy(subscription = withBenefits.subscription.copy(promoCode = Some(validPromotion.promoCode)))
  }
}

trait BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData
}

class FreeTrialApplicator(freeTrial: FreeTrialBenefit) extends BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData) = {
    val subscription = subscriptionData.subscription
    subscriptionData.copy(
      subscription = subscription.copy(
        contractAcceptanceDate = subscription.contractAcceptanceDate.plusDays(freeTrial.duration.getDays)
      )
    )
  }
}

class DiscountApplicator(discount: DiscountBenefit, config: PromotionsDiscountConfig) extends BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData) = {
    subscriptionData.copy(
      ratePlanData = subscriptionData.ratePlanData.::(discountRatePlan)
    )
  }

  def discountRatePlan = RatePlanData(
    RatePlan(config.productRatePlanId),
    List(RatePlanChargeData(
      DiscountRatePlanCharge(
        config.productRatePlanChargeId,
        discountPercentage = discount.amount,
        upToPeriods = discount.durationMonths
      )
    )),
    Nil
  )
}

class IncentiveApplicator(incentive: IncentiveBenefit) extends BenefitApplicator with LazyLogging {
  def applyTo(subscriptionData: SubscriptionData) = {
    logger.warn(s"Ignoring promo code $incentive because Incentive codes are not currently implemented")
    subscriptionData
  }
}

object PromotionApplicator {
  def apply(validPromotion: ValidatedPromotion, config: PromotionsDiscountConfig): PromotionApplicator = new PromotionApplicator(validPromotion, config)
}
