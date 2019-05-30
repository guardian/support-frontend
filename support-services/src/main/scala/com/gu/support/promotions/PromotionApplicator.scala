package com.gu.support.promotions

import com.gu.support.config.PromotionsDiscountConfig
import com.gu.support.zuora.api._
import com.typesafe.scalalogging.LazyLogging

class PromotionApplicator(promotion: PromotionWithCode, config: PromotionsDiscountConfig) {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData = {

    val benefitApplicators = List(
      promotion.promotion.freeTrial.map(new FreeTrialApplicator(_)),
      promotion.promotion.discount.map(new DiscountApplicator(_, config)),
      promotion.promotion.incentive.map(new IncentiveApplicator(_))
    ).flatten

    val withBenefits = benefitApplicators
      .foldLeft(subscriptionData) { case (currentData, applicator) => applicator.applyTo(currentData) }

    withBenefits.copy(subscription = withBenefits.subscription.copy(promoCode = Some(promotion.promoCode)))
  }
}

trait BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData
}

class FreeTrialApplicator(freeTrial: FreeTrialBenefit) extends BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData = {
    val subscription = subscriptionData.subscription
    subscriptionData.copy(
      subscription = subscription.copy(
        contractAcceptanceDate = subscription.contractAcceptanceDate.plusDays(freeTrial.duration.getDays)
      )
    )
  }
}

class DiscountApplicator(discount: DiscountBenefit, config: PromotionsDiscountConfig) extends BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData = {
    subscriptionData.copy(
      ratePlanData = subscriptionData.ratePlanData.::(discountRatePlan)
    )
  }

  def discountRatePlan: RatePlanData = RatePlanData(
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
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData = {
    logger.warn(s"Ignoring promo code $incentive because Incentive codes are not currently implemented")
    subscriptionData
  }
}

object PromotionApplicator {
  def apply(promotion: PromotionWithCode, config: PromotionsDiscountConfig): PromotionApplicator = new PromotionApplicator(promotion, config)
}
