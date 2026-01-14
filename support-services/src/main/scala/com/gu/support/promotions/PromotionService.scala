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
  private def allPromotions = promotionCollection.all.toList

  def environment = if (config.tables.promotions.contains("PROD")) { "PROD" }
  else { "CODE" }

  def findPromotion(promoCode: PromoCode): Either[PromoError, PromotionWithCode] =
    promotionCollection.all.toList
      .filter(_.promoCodes.exists(_ == promoCode))
      .map(PromotionWithCode(promoCode, _)) match {
      case Nil => Left(NoSuchCode)
      case code :: Nil => Right(code)
      case tooMany => Left(DuplicateCode(tooMany.mkString(", ")))
    }

  // promoCodes here is expected to be a small list of default promos plus one from the querystring
  def findPromotions(promoCodes: List[PromoCode]): List[PromotionWithCode] = {
    val promosByCode: Map[PromoCode, List[Promotion]] =
      allPromotions
        .flatMap(promo => promo.promoCodes.map(code => code -> promo))
        .groupMap(_._1)(_._2)

    promoCodes.foldLeft(List.empty[PromotionWithCode]) { (acc, promoCode) =>
      acc ++ promosByCode.getOrElse(promoCode, Nil).map(promotion => PromotionWithCode(promoCode, promotion))
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
