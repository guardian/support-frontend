package services

import com.gu.i18n.CountryGroup
import com.gu.support.promotions.PromoWithCatalogInformation
import org.joda.time.DateTime

/** Filters promotions from [[CachedPromotionsService]] down to those which can currently be applied on a given page -
  * the equivalent of the product/country/date checks the legacy `PromotionValidator` performed.
  *
  * [[CachedPromotionsService]] deliberately doesn't filter out inactive promotions (the promotion-terms page needs to
  * show terms for expired promotions), so pages offering promotions for sale must filter with this before injecting
  * them into `window.guardian`.
  */
object ApplicablePromotions {

  /** Promotions which are currently active, available in at least one country in `countryGroup` and apply to at least
    * one rate plan of one of `productKeys`. Order is preserved.
    */
  def filter(
      promotions: Seq[PromoWithCatalogInformation],
      productKeys: Set[String],
      countryGroup: CountryGroup,
      now: DateTime = DateTime.now(),
  ): Seq[PromoWithCatalogInformation] =
    promotions.filter(promotion =>
      isActive(promotion, now) &&
        appliesToCountryGroup(promotion, countryGroup) &&
        appliesToAnyProduct(promotion, productKeys),
    )

  private def isActive(promotion: PromoWithCatalogInformation, now: DateTime): Boolean =
    !promotion.startTimestamp.isAfter(now) && promotion.endTimestamp.forall(_.isAfter(now))

  private def appliesToCountryGroup(promotion: PromoWithCatalogInformation, countryGroup: CountryGroup): Boolean =
    countryGroup.countries.exists(promotion.appliesTo.countries.contains)

  private def appliesToAnyProduct(promotion: PromoWithCatalogInformation, productKeys: Set[String]): Boolean =
    promotion.appliesTo.catalogRatePlans.exists(ratePlan => productKeys.contains(ratePlan.productKey))
}
