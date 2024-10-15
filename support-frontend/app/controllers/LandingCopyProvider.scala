package controllers

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog._
import com.gu.support.config.{Stage, TouchPointEnvironments}
import com.gu.support.promotions.{ProductPromotionCopy, PromotionCopy, PromotionServiceProvider}
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}

class LandingCopyProvider(
    promotionServiceProvider: PromotionServiceProvider,
    stage: Stage,
) {
  private val promoCopyService = ProductPromotionCopy(promotionServiceProvider.forUser(false), stage)

  // To see if there is any promotional copy in place for this page we need to get a country in the current region (country group)
  // this is because promotions apply to countries not regions. We can use any country however because the promo tool UI only deals
  // with regions and then adds all the countries for that region to the promotion
  def promotionCopy(
      queryPromos: List[String],
      product1: Product,
      countryCode: String,
      isGift: Boolean = false,
  ): Option[PromotionCopy] =
    for {
      countryGroup <- CountryGroup.byId(countryCode)
      productRatePlanIds = getProductRatePlanIdsForCountryGroup(product1, countryGroup, isGift)
      promoCopy <- promotionCopyForCountryGroup(queryPromos, productRatePlanIds, countryGroup)
    } yield promoCopy

  def getProductRatePlanIdsForCountryGroup(product: Product, countryGroup: CountryGroup, isGift: Boolean) = {
    val environment = TouchPointEnvironments.fromStage(stage)
    val readerType = if (isGift) Gift else Direct
    (product, countryGroup) match {
      case (GuardianWeekly, CountryGroup.RestOfTheWorld) =>
        GuardianWeekly
          .ratePlans(environment)
          .filter(productRatePlan =>
            productRatePlan.fulfilmentOptions == RestOfWorld && productRatePlan.readerType == readerType,
          )
          .map(_.id)
      case (GuardianWeekly, _) =>
        GuardianWeekly
          .ratePlans(environment)
          .filter(productRatePlan =>
            productRatePlan.fulfilmentOptions == Domestic && productRatePlan.readerType == readerType,
          )
          .map(_.id)
      case _ => product.getProductRatePlanIds(environment)
    }
  }

  def promotionCopyForCountryGroup(
      queryPromos: List[String],
      productRatePlanIds: List[ProductRatePlanId],
      countryGroup: CountryGroup,
  ): Option[PromotionCopy] = {
    queryPromos
      .to(LazyList) // For efficiency - only call getCopyForPromoCode until we find a valid promo
      .map(promoCode => promoCopyService.getCopyForPromoCode(promoCode, productRatePlanIds, countryGroup))
      .collectFirst { case Some(promoCopy) => promoCopy }
  }
}
