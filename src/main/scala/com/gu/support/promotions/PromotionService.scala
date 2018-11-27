package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.promotions.PromotionValidator.PromotionExtensions
import org.joda.time.DateTime

class PromotionService(promotionCollection: PromotionCollection) {

  def findPromotion(promoCode: PromoCode): Option[AnyPromotion] =
    promotionCollection.all().find(_.promoCodes.exists(_ == promoCode))

  def validatePromotion(promoCode: PromoCode, country: Country, productRatePlanId: ProductRatePlanId, now: DateTime = DateTime.now): Either[PromoError, PromoCode] =
    findPromotion(promoCode) match {
      case Some(p) => p.validateFor(productRatePlanId, country, now)
        .headOption
        .map(err => Left(err))
        .getOrElse(Right(promoCode))

      case _ => Left(NoSuchCode)
    }
}
