package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import org.joda.time.DateTime

object PromotionValidator {
  implicit class PromotionExtensions(promotion: Promotion[_]) {
    def validateFor(productRatePlanId: ProductRatePlanId, country: Country, now: DateTime = DateTime.now()) = validateAll(Some(productRatePlanId), country, now)

    private def validateAll(maybeProductRatePlanId: Option[ProductRatePlanId] = None, country: Country, now: DateTime = DateTime.now()): List[PromoError] = {
      val errors = List(
        maybeProductRatePlanId.flatMap(validateProductRatePlan),
        validateCountry(country),
        validateDate(now)
      )
      errors.flatten
    }

    def validateProductRatePlan(productRatePlanId: ProductRatePlanId): Option[PromoError] =
      if (promotion.promotionType == Tracking || promotion.appliesTo.productRatePlanIds.contains(productRatePlanId))
        None
      else
        Some(InvalidProductRatePlan)

    def validateCountry(country: Country): Option[PromoError]=
      if (promotion.appliesTo.countries.contains(country))
        None
      else
        Some(InvalidCountry)

    def validateDate(now: DateTime): Option[PromoError] =
      if (promotion.starts.isAfter(now))
        Some(PromotionNotActiveYet)
      else if (promotion.expires.exists(e => e.isEqual(now) || e.isBefore(now)))
        Some(ExpiredPromotion)
      else
        None
  }
}


