package com.gu.support.promotions

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.PromotionsConfig
import com.gu.support.promotions.PromotionValidator.PromotionExtensions
import com.gu.support.touchpoint.TouchpointService
import com.gu.support.zuora.api.SubscriptionData
import com.typesafe.scalalogging.LazyLogging

class PromotionService(config: PromotionsConfig, maybeCollection: Option[PromotionCollection] = None)
    extends TouchpointService
    with LazyLogging {
  private val promotionCollection = maybeCollection.getOrElse(new CachedDynamoPromotionCollection(config.tables))

  def environment = if (config.tables.promotions.contains("PROD")) { "PROD" }
  else { "CODE" }

  def findPromotion(promoCode: PromoCode): Either[PromoError, PromotionWithCode] =
    promotionCollection.allByCode.get(promoCode) match {
      case Some(promotion) => Right(PromotionWithCode(promoCode, promotion))
      case None => Left(NoSuchCode)
    }

  // promoCodes here is expected to be a small list of default promos plus one from the querystring
  def findPromotions(promoCodes: List[PromoCode]): List[PromotionWithCode] = {
    val promosByCode = promotionCollection.allByCode
    promoCodes.flatMap { promoCode =>
      promosByCode.get(promoCode).map(PromotionWithCode(promoCode, _))
    }
  }

  def validatePromotion(
      promotion: PromotionWithCode,
      countryGroup: CountryGroup,
      productRatePlanId: ProductRatePlanId,
      isRenewal: Boolean,
  ): Either[PromoError, PromotionWithCode] =
    promotion.promotion
      .validateFor(productRatePlanId, countryGroup, isRenewal)
      .headOption
      .map(err => Left(err))
      .getOrElse(Right(promotion))

  def applyPromotion(
      promotion: PromotionWithCode,
      countryGroup: CountryGroup,
      productRatePlanId: ProductRatePlanId,
      subscriptionData: SubscriptionData,
      isRenewal: Boolean,
  ): Either[PromoError, SubscriptionData] =
    validatePromotion(promotion, countryGroup, productRatePlanId, isRenewal)
      .map(PromotionApplicator(_, config.discount).applyTo(subscriptionData))

}
