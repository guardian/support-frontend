package com.gu.promotions

import com.gu.support.config.PromotionsDiscountConfig
import com.gu.support.promotions.{DiscountBenefit, FreeTrialBenefit, IncentiveBenefit, Promotion}
import com.gu.support.zuora.api._

class PromotionApplicator(promotion: Promotion, config: PromotionsDiscountConfig) {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData = {

    val benefitApplicators = List(
      promotion.freeTrial.map(new FreeTrialApplicator(_)),
      promotion.discount.map(new DiscountApplicator(_, config)),
      promotion.incentive.map(new IncentiveApplicator(_))
    ).flatten

    benefitApplicators.foldLeft(subscriptionData){case (currentData, applicator) => applicator.applyTo(currentData)}
  }
}

trait BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData
}

class FreeTrialApplicator(freeTrial: FreeTrialBenefit) extends BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData) = subscriptionData
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

class IncentiveApplicator(freeTrial: IncentiveBenefit) extends BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData) = subscriptionData
}

object PromotionApplicator {
  def apply(promotion: Promotion, config: PromotionsDiscountConfig): PromotionApplicator = new PromotionApplicator(promotion, config)
}
