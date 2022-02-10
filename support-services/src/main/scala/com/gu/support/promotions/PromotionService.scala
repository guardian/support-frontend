package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.PromotionsConfig
import com.gu.support.promotions.PromotionValidator.PromotionExtensions
import com.gu.support.touchpoint.TouchpointService
import com.gu.support.zuora.api.SubscriptionData
import com.typesafe.scalalogging.LazyLogging

class PromotionService(config: PromotionsConfig, maybeCollection: Option[PromotionCollection] = None)
    extends TouchpointService
    with LazyLogging {
  val promotionCollection = maybeCollection.getOrElse(new CachedDynamoPromotionCollection(config.tables))

  // This is a small hack to allow us to start using promotions to handle 6 for 6 without having to build the tooling
  private def allWith6For6 = promotionCollection.all.toList :+ Promotions.SixForSixPromotion

  def findPromotion(promoCode: PromoCode): Either[PromoError, PromotionWithCode] =
    allWith6For6
      .filter(_.promoCodes.exists(_ == promoCode))
      .map(PromotionWithCode(promoCode, _)) match {
      case Nil => Left(NoSuchCode)
      case code :: Nil => Right(code)
      case tooMany => Left(DuplicateCode(tooMany.mkString(", ")))
    }

  def findPromotions(promoCodes: List[PromoCode]): List[PromotionWithCode] =
    allWith6For6
      .foldLeft(List.empty[PromotionWithCode]) { (acc, promotion) =>
        val maybeCode = promoCodes.intersect(promotion.promoCodes.toList).headOption
        maybeCode.map(code => acc :+ PromotionWithCode(code, promotion)).getOrElse(acc)
      }

  def validatePromotion(
      promotion: PromotionWithCode,
      country: Country,
      productRatePlanId: ProductRatePlanId,
      isRenewal: Boolean,
  ): Either[PromoError, PromotionWithCode] =
    promotion.promotion
      .validateFor(productRatePlanId, country, isRenewal)
      .headOption
      .map(err => Left(err))
      .getOrElse(Right(promotion))

  def applyPromotion(
      promotion: PromotionWithCode,
      country: Country,
      productRatePlanId: ProductRatePlanId,
      subscriptionData: SubscriptionData,
      isRenewal: Boolean,
  ): Either[PromoError, SubscriptionData] =
    validatePromotion(promotion, country, productRatePlanId, isRenewal)
      .map(PromotionApplicator(_, config.discount).applyTo(subscriptionData))

}
