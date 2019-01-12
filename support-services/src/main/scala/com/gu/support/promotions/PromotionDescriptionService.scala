package com.gu.support.promotions

import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.catalog._
import com.gu.support.workers.BillingPeriod
import PromotionDescriptionService.getDiscountedPrice
import scala.math.BigDecimal.RoundingMode

class PromotionDescriptionService(promotionService: PromotionService, catalogService: CatalogService) {

  def getPromotionDescription[T <: Product](
    promoCode: PromoCode,
    product: T,
    country: Country,
    billingPeriod: BillingPeriod,
    fulfilmentOptions: FulfilmentOptions[T],
    productOptions: ProductOptions[T],
    isRenewal: Boolean): Option[PromotionDescription] =
    for {
      productRatePlan <- product.getProductRatePlan(billingPeriod, fulfilmentOptions, productOptions)
      validPromotion <- promotionService.validatePromoCode(promoCode, country, productRatePlan.id, isRenewal).toOption
      currency <- CountryGroup.byCountryCode(country.alpha2).map(_.currency)
      price <- catalogService.getPrice(product, currency, billingPeriod, fulfilmentOptions, productOptions)
    } yield getDescription(validPromotion, price, currency, billingPeriod)

  private def getDescription(validPromotion: ValidatedPromotion, price: Price, currency: Currency, billingPeriod: BillingPeriod) = {
    import validPromotion._

    val discountedPrice = promotion.discount.map(getDiscountedPrice(price, _))

    PromotionDescription(
      promotion.description,
      promotion.discount,
      promotion.freeTrial,
      promotion.incentive,
      billingPeriod,
      price,
      discountedPrice
    )
  }
}

object PromotionDescriptionService {
  def getDiscountedPrice(originalPrice: Price, discountBenefit: DiscountBenefit): Price = {
    val multiplier = (100 - discountBenefit.amount) / 100
    val newPrice = originalPrice.value * multiplier
    originalPrice.update(newPrice.setScale(2, RoundingMode.HALF_DOWN))
  }

}
