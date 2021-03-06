package controllers

import com.gu.i18n.Country.UK
import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.Product
import com.gu.support.config.Stage
import com.gu.support.promotions.{ProductPromotionCopy, PromoCode, PromotionCopy, PromotionServiceProvider}

class LandingCopyProvider(
  promotionServiceProvider: PromotionServiceProvider,
  stage: Stage
) {

  // To see if there is any promotional copy in place for this page we need to get a country in the current region (country group)
  // this is because promotions apply to countries not regions. We can use any country however because the promo tool UI only deals
  // with regions and then adds all the countries for that region to the promotion
  def promotionCopy(queryPromos: List[String], product1: Product, countryCode: String, defaultCopyPromoCode: PromoCode): Option[PromotionCopy] = {
    val country = (for {
      countryGroup <- CountryGroup.byId(countryCode)
      country <- countryGroup.countries.headOption
    } yield country).getOrElse(UK)
    promotionCopyForPrimaryCountry(queryPromos, product1, country, defaultCopyPromoCode)
  }

  def promotionCopyForPrimaryCountry(queryPromos: List[String], product1: Product, country: Country, defaultCopyPromoCode: PromoCode): Option[PromotionCopy] = {
    val promoCode = queryPromos.headOption.getOrElse(defaultCopyPromoCode)
    ProductPromotionCopy(promotionServiceProvider.forUser(false), stage)
      .getCopyForPromoCode(promoCode, product1, country)
  }

}
