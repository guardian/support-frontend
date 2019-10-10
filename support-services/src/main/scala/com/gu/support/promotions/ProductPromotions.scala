package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.config.{Stage, TouchPointEnvironment, TouchPointEnvironments}
import PromotionValidator._
import com.gu.support.catalog.Product

class ProductPromotions(promotionService: PromotionService, touchPointEnvironment: TouchPointEnvironment) {
  def validatePromoCode(promoCode: PromoCode, product: Product, country: Country): Option[PromotionWithCode] = {
    val productRatePlanIds = product.getProductRatePlanIds(touchPointEnvironment)
    val promotion = promotionService.findPromotion(promoCode)
    promotion.find(_.promotion.validForAnyProductRatePlan(productRatePlanIds, country, isRenewal = false).nonEmpty)
  }
}

object ProductPromotions {
  def apply(promotionService: PromotionService, stage: Stage): ProductPromotions =
    new ProductPromotions(promotionService, TouchPointEnvironments.fromStage(stage))
}
