package controllers

import com.gu.i18n.Country.UK
import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog.Product
import com.gu.support.config.Stage
import com.gu.support.promotions.{ProductPromotionCopy, PromoCode, PromotionCopy, PromotionServiceProvider}

class LandingCopyProvider(
    promotionServiceProvider: PromotionServiceProvider,
    stage: Stage,
) {
  private val promoCopyService = ProductPromotionCopy(promotionServiceProvider.forUser(false), stage)

  // To see if there is any promotional copy in place for this page we need to get a country in the current region (country group)
  // this is because promotions apply to countries not regions. We can use any country however because the promo tool UI only deals
  // with regions and then adds all the countries for that region to the promotion
  def promotionCopy(promos: List[String], product1: Product, countryCode: String): Option[PromotionCopy] = {
    val country = (for {
      countryGroup <- CountryGroup.byId(countryCode)
      country <- countryGroup.countries.headOption
    } yield country).getOrElse(UK)
    println("Testing -----------------------")
    println(country)
    println(promotionCopyForPrimaryCountry(promos, product1, country))
    println("Testing -------------------------")
    promotionCopyForPrimaryCountry(promos, product1, country)
  }

  def promotionCopyForPrimaryCountry(
      promos: List[String],
      product1: Product,
      country: Country,
  ): Option[PromotionCopy] = {
    promos
      .to(LazyList) // For efficiency - only call getCopyForPromoCode until we find a valid promo
      .map(promoCode => promoCopyService.getCopyForPromoCode(promoCode, product1, country))
      .collectFirst { case Some(promoCopy) => promoCopy }
  }
}
