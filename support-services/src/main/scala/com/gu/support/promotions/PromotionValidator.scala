package com.gu.support.promotions

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.ProductRatePlanId
import org.joda.time.DateTime

object PromotionValidator {

  implicit class PromotionExtensions(promotion: Promotion) {
    def validateFor(
        productRatePlanId: ProductRatePlanId,
        countryGroup: CountryGroup,
        isRenewal: Boolean,
        now: DateTime = DateTime.now(),
    ): Seq[PromoError] =
      validateAll(Some(productRatePlanId), countryGroup, isRenewal, now)

    private def validateAll(
        maybeProductRatePlanId: Option[ProductRatePlanId] = None,
        countryGroup: CountryGroup,
        isRenewal: Boolean,
        now: DateTime = DateTime.now(),
    ): List[PromoError] = {
      val errors = List(
        maybeProductRatePlanId.flatMap(validateProductRatePlan),
        validateRenewal(isRenewal),
        validateCountryGroup(countryGroup),
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

    def validateCountryGroup(countryGroup: CountryGroup): Option[PromoError] =
      if (promotion.appliesTo.countries.intersect(countryGroup.countries.toSet).isEmpty)
        Some(InvalidCountryGroup)
      else
        None

    def validateDate(now: DateTime): Option[PromoError] =
      if (promotion.starts.isAfter(now))
        Some(PromotionNotActiveYet)
      else if (promotion.expires.exists(e => e.isEqual(now) || e.isBefore(now)))
        Some(ExpiredPromotion)
      else
        None

    def validForAnyProductRatePlan(
        productRatePlanIds: List[ProductRatePlanId],
        countryGroup: CountryGroup,
        isRenewal: Boolean,
        now: DateTime = DateTime.now(),
    ): List[ProductRatePlanId] = {
      val errors =
        productRatePlanIds.map(productRatePlanId => validateAll(Some(productRatePlanId), countryGroup, isRenewal))

      productRatePlanIds
        .zip(errors)
        .filter { case (_, errors) => errors.isEmpty }
        .map { case (productRatePlanId, _) => productRatePlanId }
    }
  }

}
