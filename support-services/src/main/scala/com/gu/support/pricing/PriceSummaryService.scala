package com.gu.support.pricing

import com.gu.i18n.{CountryGroup, Currency}
import com.gu.support.catalog._
import com.gu.support.pricing.PriceSummaryService.getDiscountedPrice
import com.gu.support.promotions._
import com.gu.support.touchpoint.TouchpointService
import com.gu.support.workers.{BillingPeriod, Monthly}

import scala.math.BigDecimal.RoundingMode

class PriceSummaryService(promotionService: PromotionService, catalogService: CatalogService) extends TouchpointService {
  private type GroupedPriceList = Map[(FulfilmentOptions, ProductOptions, BillingPeriod), Map[Currency, PriceSummary]]

  def getPrices[T <: Product](product: T, maybePromoCode: Option[PromoCode]): ProductPrices =
    product.supportedCountries(catalogService.environment).map(
      countryGroup =>
        countryGroup -> getPricesForCountryGroup(product, countryGroup, maybePromoCode)
    ).toMap

  def getPricesForCountryGroup[T <: Product](product: T, countryGroup: CountryGroup, maybePromoCode: Option[PromoCode]): CountryGroupPrices = {
    val grouped = product.ratePlans(catalogService.environment).groupBy(p => (p.fulfilmentOptions, p.productOptions, p.billingPeriod)).map {
      case (keys, productRatePlans) =>
        val priceSummaries = for {
          productRatePlan <- getSupportedRatePlansForCountryGroup(productRatePlans, countryGroup)
          price <- filterCurrencies(catalogService.getPriceList(productRatePlan).map(_.prices), countryGroup)
        } yield getPriceSummary(maybePromoCode, countryGroup, productRatePlan, price)
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


  private def getPriceSummary(maybePromoCode: Option[PromoCode], countryGroup: CountryGroup, productRatePlan: ProductRatePlan[Product], price: Price) = {
    val promotionSummary: Option[PromotionSummary] = for {
      promoCode <- maybePromoCode
      country <- countryGroup.defaultCountry.orElse(countryGroup.countries.headOption)
      validPromotion <- promotionService.validatePromoCode(promoCode, country, productRatePlan.id, isRenewal = false).toOption //Not dealing with renewals for now
    } yield getPromotionSummary(validPromotion, price, productRatePlan.billingPeriod)

    price.currency -> PriceSummary(
      price.value,
      promotionSummary
    )
  }

  private def getPromotionSummary(validatedPromotion: ValidatedPromotion, price: Price, billingPeriod: BillingPeriod) = {
    import validatedPromotion._
    PromotionSummary(
      promotion.name,
      promotion.description,
      promoCode,
      promotion.discount.map(getDiscountedPrice(price, _, billingPeriod).value),
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
  def getDiscountedPrice(originalPrice: Price, discountBenefit: DiscountBenefit, billingPeriod: BillingPeriod): Price = {
    val scaledDiscount = getDiscountScaledToPeriod(discountBenefit, billingPeriod)
    val multiplier = (100 - scaledDiscount) / 100
    val newPrice = originalPrice.value * multiplier
    originalPrice.copy(value = newPrice.setScale(2, RoundingMode.HALF_DOWN))
  }

  def getDiscountScaledToPeriod(discountBenefit: DiscountBenefit, billingPeriod: BillingPeriod): Double = {
    //If the discount period doesn't cover the whole of the billing period (often the case for annual billing)
    //we need to work out the percentage of the period that is covered and adjust the discount accordingly

    //Also if the discount period isn't an exact multiple of the billing period, eg. a five month discount on
    //a quarterly rate plan then we need to scale the discount and spread it over any billing periods affected

    val percentageOfPeriodDiscounted = discountBenefit.durationMonths.fold(1.toDouble) { durationInMonths =>
      durationInMonths.getMonths.toDouble / billingPeriod.monthsInPeriod.toDouble
    }
    val numberOfPeriodsDiscounted = Math.ceil(percentageOfPeriodDiscounted)
    val newDiscountPercent = (discountBenefit.amount * percentageOfPeriodDiscounted) / numberOfPeriodsDiscounted
    BigDecimal(newDiscountPercent).setScale(2, RoundingMode.HALF_DOWN).toDouble
  }
}
