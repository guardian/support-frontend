package com.gu.support.promotions

import com.gu.support.catalog.{GuardianWeekly, ProductRatePlan}
import com.gu.support.config.PromotionsDiscountConfig
import com.gu.support.workers.SixWeekly
import com.gu.support.zuora.api._
import com.typesafe.scalalogging.LazyLogging

class PromotionApplicator(promotion: PromotionWithCode, config: PromotionsDiscountConfig) {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData = {

    val benefitApplicators = List(
      promotion.promotion.freeTrial.map(new FreeTrialApplicator(_)),
      promotion.promotion.discount.map(new DiscountApplicator(_, config)),
      promotion.promotion.incentive.map(new IncentiveApplicator(_)),
      promotion.promotion.introductoryPrice.map(new IntroductoryPriceApplicator(_)),
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
        contractAcceptanceDate = subscription.contractAcceptanceDate.plusDays(freeTrial.duration.getDays),
      ),
    )
  }
}

class DiscountApplicator(discount: DiscountBenefit, config: PromotionsDiscountConfig) extends BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData = {
    subscriptionData.copy(
      ratePlanData = subscriptionData.ratePlanData.::(discountRatePlan),
    )
  }

  def discountRatePlan: RatePlanData = RatePlanData(
    RatePlan(config.productRatePlanId),
    List(
      RatePlanChargeData(
        DiscountRatePlanCharge(
          config.productRatePlanChargeId,
          discountPercentage = discount.amount,
          upToPeriods = discount.durationMonths,
        ),
      ),
    ),
    Nil,
  )
}

class IntroductoryPriceApplicator(introductoryPriceBenefit: IntroductoryPriceBenefit) extends BenefitApplicator {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData = {
    val subscription = subscriptionData.subscription
    val result = introductoryPriceRatePlanData(subscriptionData)
      .map(ratePlanData =>
        subscriptionData.copy(
          ratePlanData = subscriptionData.ratePlanData.::(ratePlanData),
          subscription = subscription.copy(
            contractAcceptanceDate =
              subscription.contractAcceptanceDate.plusWeeks(introductoryPriceBenefit.periodLength),
          ),
        ),
      )
      .getOrElse(subscriptionData)
    result
  }

  def introductoryPriceRatePlanData(subscriptionData: SubscriptionData): Option[RatePlanData] = {
    // For the moment we need to find the productRatePlanId and productRatePlanChargeId for the SixWeekly version of the
    // Quarterly GW product rate plan where the fulfilment option is the same ie. RestOfWorld or Domestic.
    // To genericise this for N for N or even to work with other products, we would need to have a separate product rate plan
    // for the introductory period which can apply to all products (in the way that discounts work currently) and then change
    // the fulfilment lambda to pick this up.

    val introductoryPriceStartDate = subscriptionData.subscription.contractAcceptanceDate

    for {
      recurringRatePlan <- subscriptionData.ratePlanData.headOption
      recurringProductRatePlanId = recurringRatePlan.ratePlan.productRatePlanId
      weeklyProductRatePlans = GuardianWeekly.ratePlans.values
      productRatePlansForEnvironment <- weeklyProductRatePlans.find(_.exists(_.id == recurringProductRatePlanId))
      recurringProductRatePlan <- productRatePlansForEnvironment.find(_.id == recurringProductRatePlanId)
      introductoryProductRatePlan <- productRatePlansForEnvironment.find(
        equivalentSixWeeklyProductRatePlan(recurringProductRatePlan),
      )
      introductoryProductRatePlanChargeId <- introductoryProductRatePlan.productRatePlanChargeId
    } yield RatePlanData(
      RatePlan(introductoryProductRatePlan.id),
      List(
        RatePlanChargeData(
          IntroductoryPriceRatePlanCharge(
            introductoryProductRatePlanChargeId,
            introductoryPriceBenefit.price,
            introductoryPriceStartDate,
          ),
        ),
      ),
      Nil,
    )
  }

  private def equivalentSixWeeklyProductRatePlan(recurringProduct: ProductRatePlan[GuardianWeekly.type])(
      productRatePlan: ProductRatePlan[GuardianWeekly.type],
  ) =
    productRatePlan.fulfilmentOptions == recurringProduct.fulfilmentOptions && productRatePlan.billingPeriod == SixWeekly

}

class IncentiveApplicator(incentive: IncentiveBenefit) extends BenefitApplicator with LazyLogging {
  def applyTo(subscriptionData: SubscriptionData): SubscriptionData = {
    logger.warn(s"Ignoring promo code $incentive because Incentive codes are not currently implemented")
    subscriptionData
  }
}

object PromotionApplicator {
  def apply(promotion: PromotionWithCode, config: PromotionsDiscountConfig): PromotionApplicator =
    new PromotionApplicator(promotion, config)
}
