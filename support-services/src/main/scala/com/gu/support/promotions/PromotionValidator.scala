package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import org.joda.time.DateTime

object PromotionValidator {

  implicit class PromotionExtensions(promotion: Promotion) {
    def validateFor(
        productRatePlanId: ProductRatePlanId,
        country: Country,
        isRenewal: Boolean,
        now: DateTime = DateTime.now(),
    ): Seq[PromoError] =
      validateAll(Some(productRatePlanId), country, isRenewal, now)

    private def validateAll(
        maybeProductRatePlanId: Option[ProductRatePlanId] = None,
        country: Country,
        isRenewal: Boolean,
        now: DateTime = DateTime.now(),
    ): List[PromoError] = {
      val errors = List(
        maybeProductRatePlanId.flatMap(validateProductRatePlan),
        validateRenewal(isRenewal),
        validateCountry(country),
        validateDate(now),
      )
      errors.flatten
    }

    def validateProductRatePlan(productRatePlanId: ProductRatePlanId): Option[PromoError] =
      if (promotion.tracking || promotion.appliesTo.productRatePlanIds.contains(productRatePlanId))
        None
      else
        Some(InvalidProductRatePlan)

    def validateRenewal(isRenewal: Boolean): Option[NotApplicable.type] =
      if (promotion.renewalOnly != isRenewal)
        Some(NotApplicable)
      else
        None

    def validateCountry(country: Country): Option[PromoError] =
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

    def validForAnyProductRatePlan(
        productRatePlanIds: List[ProductRatePlanId],
        country: Country,
        isRenewal: Boolean,
        now: DateTime = DateTime.now(),
    ): List[ProductRatePlanId] = {
      val errors = productRatePlanIds.map(productRatePlanId => validateAll(Some(productRatePlanId), country, isRenewal))

      productRatePlanIds
        .zip(errors)
        .filter { case (_, errors) => errors.isEmpty }
        .map { case (productRatePlanId, _) => productRatePlanId }
    }
  }

}
