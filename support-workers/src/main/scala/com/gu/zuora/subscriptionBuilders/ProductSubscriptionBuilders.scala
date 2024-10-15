package com.gu.zuora.subscriptionBuilders

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog
import com.gu.support.catalog.{ProductRatePlan, ProductRatePlanId}
import com.gu.support.promotions.{InvalidCountryGroup, PromoCode, PromoError, PromotionService}
import com.gu.support.workers.AppliedPromotion
import com.gu.support.workers.exceptions.CatalogDataNotFoundException
import com.gu.support.zuora.api._

object ProductSubscriptionBuilders {

  def validateRatePlan(
      maybeProductRatePlan: Option[ProductRatePlan[catalog.Product]],
      productDescription: String,
  ): ProductRatePlanId =
    maybeProductRatePlan.map(_.id) match {
      case Some(value) => value
      case None => throw new CatalogDataNotFoundException(s"RatePlanId not found for $productDescription")
    }

  def applyPromoCodeIfPresent(
      promotionService: PromotionService,
      // Remove after deploy of appliedPromotion logic
      maybePromoCode: Option[PromoCode],
      country: Country,
      // ---
      maybeAppliedPromotion: Option[AppliedPromotion],
      productRatePlanId: ProductRatePlanId,
      subscriptionData: SubscriptionData,
  ): Either[PromoError, SubscriptionData] = {
    // Remove after deploy of appliedPromotion logic
    case class PromoWithCountryGroup(promoCode: PromoCode, countryGroup: CountryGroup);
    val maybePromoWithCountryGroup: Option[PromoWithCountryGroup] = maybeAppliedPromotion
      .flatMap(appliedPromotion =>
        for {
          countryGroup <- CountryGroup.byId(appliedPromotion.countryGroupId)
          promoCode <- Some(appliedPromotion.promoCode)
        } yield PromoWithCountryGroup(promoCode, countryGroup),
      )
      .orElse(for {
        promoCode <- maybePromoCode
        countryGroup <- CountryGroup.byCountryCode(country.alpha2)
      } yield PromoWithCountryGroup(promoCode, countryGroup))
    // ---

    val withPromotion = maybePromoWithCountryGroup.map(promoWithCountryGroup =>
      for {
        promotionWithCode <- promotionService.findPromotion(promoWithCountryGroup.promoCode)
        subscriptionWithPromotion <- promotionService.applyPromotion(
          promotionWithCode,
          promoWithCountryGroup.countryGroup,
          productRatePlanId,
          subscriptionData,
          isRenewal = false,
        )
      } yield subscriptionWithPromotion,
    )

    withPromotion.getOrElse(Right(subscriptionData))
  }

}
