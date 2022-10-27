package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.{Stage, TouchPointEnvironment, TouchPointEnvironments}
import com.gu.support.promotions.PromotionValidator._

class ProductPromotionCopy(promotionService: PromotionService, touchPointEnvironment: TouchPointEnvironment) {
  def getCopyForPromoCode(promoCode: PromoCode, productRatePlanIds: List[ProductRatePlanId], country: Country): Option[PromotionCopy] = {
    val promotion = promotionService.findPromotion(promoCode)
    promotion.toOption // if promo code not valid, just ignore
      .find(_.promotion.validForAnyProductRatePlan(productRatePlanIds, country, isRenewal = false).nonEmpty)
      .flatMap(_.promotion.landingPage)
  }
}

object ProductPromotionCopy {
  def apply(promotionService: PromotionService, stage: Stage): ProductPromotionCopy =
    new ProductPromotionCopy(promotionService, TouchPointEnvironments.fromStage(stage))
}
