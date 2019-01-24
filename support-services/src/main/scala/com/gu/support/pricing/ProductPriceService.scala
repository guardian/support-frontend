package com.gu.support.pricing

import com.gu.i18n.{Country, CountryGroup}
import com.gu.support.catalog._
import ProductPriceService.getDiscountedPrice
import com.gu.support.promotions._
import com.gu.support.workers.BillingPeriod

import scala.math.BigDecimal.RoundingMode

class ProductPriceService(promotionService: PromotionService, catalogService: CatalogService) {
  type CountryPricing = Map[FulfilmentOptions, Map[ProductOptions, Map[BillingPeriod, List[PriceSummary]]]]
  type ProductPricing = Map[CountryGroup, CountryPricing]

  def getPrices[T <: Product](product: T, maybePromoCode: Option[PromoCode]): ProductPricing =
    product.supportedCountries.map(
      countryGroup =>
        countryGroup -> getPricesForCountryGroup(product, countryGroup, maybePromoCode)
    ).toMap

  def getPricesForCountryGroup[T <: Product](product: T, countryGroup: CountryGroup, maybePromoCode: Option[PromoCode]): CountryPricing = {
    val grouped = product.ratePlans.groupBy(p => (p.fulfilmentOptions, p.productOptions, p.billingPeriod)).map {
      case (keys, productRatePlans) =>
        val priceSummaries = for {
          productRatePlan <- productRatePlans.filter(p => p.supportedTerritories.contains(countryGroup))
          price <- filterCurrencies(catalogService.getPriceList(productRatePlan).map(_.prices), countryGroup)
        } yield getPriceSummary(maybePromoCode, countryGroup, productRatePlan.id, price)
        (keys, priceSummaries)
    }
    nestPriceLists(grouped)
  }

  private def filterCurrencies(maybePrices: Option[List[Price]], countryGroup: CountryGroup) = {
    // Try to filter the prices we return to only include the currency for the current country group
    // For some combinations of product and country group this will not be possible
    // eg. for Guardian Weekly ROW product rate plans there is no price list for any country group other
    // than RestOfTheWorld as they should buy a Domestic rate plan instead
    val prices = maybePrices.getOrElse(Nil)
    prices.filter(price => countryGroup.supportedCurrencies.contains(price.currency))
  }

  private def getPriceSummary(maybePromoCode: Option[PromoCode], countryGroup: CountryGroup, productRatePlanId: ProductRatePlanId, price: Price) = {
    val promotion: Option[PromotionSummary] = for {
      promoCode <- maybePromoCode
      country <- countryGroup.defaultCountry.orElse(countryGroup.countries.headOption)
      validPromotion <- promotionService.validatePromoCode(promoCode, country, productRatePlanId, isRenewal = false).toOption //Not dealing with renewals for now
    } yield getPromotionSummary(validPromotion, price)

    PriceSummary(
      price.value,
      price.currency,
      promotion
    )
  }

  private def getPromotionSummary(validatedPromotion: ValidatedPromotion, price: Price) = {
    import validatedPromotion._
    PromotionSummary(
      promotion.name,
      promotion.description,
      promoCode,
      promotion.discount.map(getDiscountedPrice(price, _).value),
      promotion.discount,
      promotion.freeTrial,
      promotion.incentive
    )
  }

  private def nestPriceLists(groupedPriceList: Map[(FulfilmentOptions, ProductOptions, BillingPeriod), List[PriceSummary]]): CountryPricing =
    groupedPriceList
      .filter(_._2.nonEmpty) // Remove invalid pricing options eg. Guardian Weekly Domestic rate plans in RestOfTheWorld countries
      .foldLeft(Map.empty[FulfilmentOptions, Map[ProductOptions, Map[BillingPeriod, List[PriceSummary]]]]) {
      case (acc, ((fulfilment, productOptions, billing), list)) =>

        val existingProducts = acc.getOrElse(fulfilment, Map.empty[ProductOptions, Map[BillingPeriod, List[PriceSummary]]])
        val existingBillingPeriods = existingProducts.getOrElse(productOptions, Map.empty[BillingPeriod, List[PriceSummary]])

        val newBillingPeriods = existingBillingPeriods ++ Map(billing -> list)
        val newProducts = existingProducts ++ Map(productOptions -> newBillingPeriods)

        acc ++ Map(fulfilment -> newProducts)
    }
}

object ProductPriceService {
  def getDiscountedPrice(originalPrice: Price, discountBenefit: DiscountBenefit): Price = {
    val multiplier = (100 - discountBenefit.amount) / 100
    val newPrice = originalPrice.value * multiplier
    originalPrice.update(newPrice.setScale(2, RoundingMode.HALF_DOWN))
  }
}
