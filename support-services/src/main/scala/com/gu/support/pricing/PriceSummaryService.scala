package com.gu.support.pricing

import com.gu.i18n.{CountryGroup, Currency}
import com.gu.support.catalog._
import com.gu.support.pricing.PriceSummaryService.getDiscountedPrice
import com.gu.support.promotions._
import com.gu.support.touchpoint.TouchpointService
import com.gu.support.workers.BillingPeriod

import scala.math.BigDecimal.RoundingMode

class PriceSummaryService(promotionService: PromotionService, catalogService: CatalogService) extends TouchpointService {
  private type GroupedPriceList = Map[(FulfilmentOptions, ProductOptions, BillingPeriod), Map[Currency, PriceSummary]]

  def getPrices[T <: Product](product: T, maybePromoCode: Option[PromoCode]): ProductPrices =
    product.supportedCountries.map(
      countryGroup =>
        countryGroup -> getPricesForCountryGroup(product, countryGroup, maybePromoCode)
    ).toMap

  def getPricesForCountryGroup[T <: Product](product: T, countryGroup: CountryGroup, maybePromoCode: Option[PromoCode]): CountryGroupPrices = {
    val grouped = product.ratePlans.groupBy(p => (p.fulfilmentOptions, p.productOptions, p.billingPeriod)).map {
      case (keys, productRatePlans) =>
        val priceSummaries = for {
          productRatePlan <- getSupportedRatePlansForCountryGroup(productRatePlans, countryGroup)
          price <- filterCurrencies(catalogService.getPriceList(productRatePlan).map(_.prices), countryGroup)
        } yield getPriceSummary(maybePromoCode, countryGroup, productRatePlan.id, price)
        (keys, priceSummaries.toMap)
    }
    nestPriceLists(grouped)
  }

  private def getSupportedRatePlansForCountryGroup(productRatePlans: List[ProductRatePlan[Product]], countryGroup: CountryGroup) =
    productRatePlans.filter(p => p.supportedTerritories.contains(countryGroup))

  private def filterCurrencies(maybePrices: Option[List[Price]], countryGroup: CountryGroup) =
  // Filter the prices we return to only include the supported currencies for the current country group
    maybePrices
      .getOrElse(Nil)
      .filter(price => countryGroup.supportedCurrencies.contains(price.currency))


  private def getPriceSummary(maybePromoCode: Option[PromoCode], countryGroup: CountryGroup, productRatePlanId: ProductRatePlanId, price: Price) = {
    val promotionSummary: Option[PromotionSummary] = for {
      promoCode <- maybePromoCode
      country <- countryGroup.defaultCountry.orElse(countryGroup.countries.headOption)
      validPromotion <- promotionService.validatePromoCode(promoCode, country, productRatePlanId, isRenewal = false).toOption //Not dealing with renewals for now
    } yield getPromotionSummary(validPromotion, price)

    price.currency -> PriceSummary(
      price.value,
      promotionSummary
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

  private def nestPriceLists(groupedPriceList: GroupedPriceList): CountryGroupPrices =
    removeInvalidPricingOptions(groupedPriceList)
      .foldLeft(Map.empty[FulfilmentOptions, Map[ProductOptions, Map[BillingPeriod, Map[Currency, PriceSummary]]]]) {
      case (acc, ((fulfilment, productOptions, billing), list)) =>

        val existingProducts = acc.getOrElse(fulfilment, Map.empty[ProductOptions, Map[BillingPeriod, Map[Currency, PriceSummary]]])
        val existingBillingPeriods = existingProducts.getOrElse(productOptions, Map.empty[BillingPeriod, Map[Currency, PriceSummary]])

        val newBillingPeriods = existingBillingPeriods ++ Map(billing -> list)
        val newProducts = existingProducts ++ Map(productOptions -> newBillingPeriods)

        acc ++ Map(fulfilment -> newProducts)
    }

  private def removeInvalidPricingOptions(groupedPriceList: GroupedPriceList) =
    groupedPriceList.filter(_._2.nonEmpty) // eg. Guardian Weekly Domestic rate plans in RestOfTheWorld countries
}

object PriceSummaryService {
  def getDiscountedPrice(originalPrice: Price, discountBenefit: DiscountBenefit): Price = {
    val multiplier = (100 - discountBenefit.amount) / 100
    val newPrice = originalPrice.value * multiplier
    originalPrice.copy(value = newPrice.setScale(2, RoundingMode.HALF_DOWN))
  }
}
