package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.PromotionsConfig
import com.gu.support.promotions.PromotionValidator.PromotionExtensions
import com.gu.support.zuora.api.SubscriptionData
import com.typesafe.scalalogging.LazyLogging

class PromotionService(config: PromotionsConfig, maybeCollection: Option[PromotionCollection] = None) extends LazyLogging {
  val promotionCollection = maybeCollection.getOrElse(new DynamoPromotionCollection(config.tables))

  def findPromotion(promoCode: PromoCode): Option[Promotion] =
    promotionCollection.all.find(_.promoCodes.exists(_ == promoCode))

  def validatePromoCode(promoCode: PromoCode, country: Country, productRatePlanId: ProductRatePlanId, isRenewal: Boolean): Either[PromoError, ValidatedPromotion] =
    findPromotion(promoCode)
      .map(validatePromotion(_, country, productRatePlanId, isRenewal).map(ValidatedPromotion(promoCode, _)))
      .getOrElse(Left(NoSuchCode))

  def validatePromotion(promotion: Promotion, country: Country, productRatePlanId: ProductRatePlanId, isRenewal: Boolean): Either[PromoError, Promotion] =
    promotion.validateFor(productRatePlanId, country, isRenewal)
      .headOption
      .map(err => Left(err))
      .getOrElse(Right(promotion))

  def applyPromotion(
    promoCode: PromoCode,
    country: Country,
    productRatePlanId: ProductRatePlanId,
    subscriptionData: SubscriptionData,
    isRenewal: Boolean
  ): SubscriptionData =
    validatePromoCode(promoCode, country, productRatePlanId, isRenewal)
      .map(PromotionApplicator(_, config.discount).applyTo(subscriptionData))
      .toOption.getOrElse(subscriptionData)

}
