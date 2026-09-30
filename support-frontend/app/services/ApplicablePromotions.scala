package services

import com.gu.i18n.CountryGroup
import com.gu.support.promotions.PromoWithCatalogInformation
import org.joda.time.DateTime

object ApplicablePromotions {

  /** Filters promotions to those which are
    *   - currently active
    *   - available in at least one country in `countryGroup`
    *   - apply to at least one rate plan from any product in `productKeys`
    * If `isGift` is true then the plan must be a gift rate plan.
    */
  def filter(
      promotions: Seq[PromoWithCatalogInformation],
      productKeys: Set[String],
      isGift: Boolean,
      countryGroup: CountryGroup,
      now: DateTime = DateTime.now(),
  ): Seq[PromoWithCatalogInformation] =
    promotions.filter(promotion =>
      isActive(promotion, now) &&
        appliesToCountryGroup(promotion, countryGroup) &&
        appliesToAnyRatePlan(promotion, productKeys, isGift),
    )

  private def isActive(promotion: PromoWithCatalogInformation, now: DateTime): Boolean =
    !promotion.startTimestamp.isAfter(now) && promotion.endTimestamp.forall(_.isAfter(now))

  private def appliesToCountryGroup(promotion: PromoWithCatalogInformation, countryGroup: CountryGroup): Boolean =
    countryGroup.countries.exists(promotion.appliesTo.countries.contains)

  private def appliesToAnyRatePlan(
      promotion: PromoWithCatalogInformation,
      productKeys: Set[String],
      isGift: Boolean,
  ): Boolean =
    promotion.appliesTo.catalogRatePlans.exists(ratePlan =>
      productKeys.contains(ratePlan.productKey) && ratePlan.isGift == isGift,
    )
}
