package com.gu.support.promotions

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.{Stage, TouchPointEnvironment, TouchPointEnvironments}
import com.gu.support.promotions.PromotionValidator._

class ProductPromotionCopy(promotionService: PromotionService, touchPointEnvironment: TouchPointEnvironment) {
  def getCopyForPromoCode(
      promoCode: PromoCode,
      productRatePlanIds: List[ProductRatePlanId],
      countryGroup: CountryGroup,
  ): Option[PromotionCopy] = {
    val promotion = promotionService.findPromotion(promoCode)
    promotion.toOption // if promo code not valid, just ignore
      .find(_.promotion.validForAnyProductRatePlan(productRatePlanIds, countryGroup, isRenewal = false).nonEmpty)
      .flatMap(_.promotion.landingPage)
  }
}

object ProductPromotionCopy {
  def apply(promotionService: PromotionService, stage: Stage): ProductPromotionCopy =
    new ProductPromotionCopy(promotionService, TouchPointEnvironments.fromStage(stage))
}
