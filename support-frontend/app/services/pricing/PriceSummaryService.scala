package services.pricing

import com.gu.i18n.{CountryGroup, Currency}
import com.gu.support.catalog._
import services.pricing.PriceSummaryService.{getDiscountedPrice, getNumberOfDiscountedPeriods}
import com.gu.support.promotions._
import com.gu.support.touchpoint.TouchpointService
import com.gu.support.workers.BillingPeriod
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import org.joda.time.Months

import scala.math.BigDecimal.RoundingMode

class PriceSummaryService(
    promotionService: PromotionService,
    defaultPromotionService: DefaultPromotionService,
    catalogService: CatalogService,
) extends TouchpointService {
  private type GroupedPriceList = Map[(FulfilmentOptions, ProductOptions, BillingPeriod), Map[Currency, PriceSummary]]

  def getPrices[T <: Product](
      product: T,
      promoCodes: List[PromoCode],
      readerType: ReaderType = Direct,
  ): ProductPrices = {
    val defaultPromos = getDefaultPromoCodes(product)
    val promotions = promotionService.findPromotions(promoCodes ++ defaultPromos)
    product
      .supportedCountries(catalogService.environment)
      .map(countryGroup => countryGroup -> getPricesForCountryGroup(product, countryGroup, promotions, readerType))
      .toMap
  }

  def getDefaultPromoCodes(product: Product): List[String] = defaultPromotionService.getPromoCodes(product)

  def getPricesForCountryGroup[T <: Product](
      product: T,
      countryGroup: CountryGroup,
      promotions: List[PromotionWithCode],
      readerType: ReaderType = Direct,
  ): CountryGroupPrices = {
    val ratePlans = product.ratePlans(catalogService.environment).filter(_.readerType == readerType)
    val grouped = ratePlans.groupBy(p => (p.fulfilmentOptions, p.productOptions, p.billingPeriod)).map {
      case (keys, productRatePlans) =>
        val priceSummaries = for {
          productRatePlan <- getSupportedRatePlansForCountryGroup(productRatePlans, countryGroup)
          price <- filterCurrencies(catalogService.getPriceList(productRatePlan).map(_.prices), countryGroup)
          saving <- catalogService.getPriceList(productRatePlan).map(_.savingVsRetail)
        } yield getPriceSummary(promotions, countryGroup, productRatePlan, price, saving)
        (keys, priceSummaries.toMap)
    }
    nestPriceLists(grouped)
  }

  private def getSupportedRatePlansForCountryGroup(
      productRatePlans: List[ProductRatePlan[Product]],
      countryGroup: CountryGroup,
  ) =
    productRatePlans.filter(p => p.supportedTerritories.contains(countryGroup))

  private def filterCurrencies(maybePrices: Option[List[Price]], countryGroup: CountryGroup) =
    // Filter the prices we return to only include the supported currencies for the current country group
    maybePrices
      .getOrElse(Nil)
      .filter(price => countryGroup.supportedCurrencies.contains(price.currency))

  private def getPriceSummary(
      promotions: List[PromotionWithCode],
      countryGroup: CountryGroup,
      productRatePlan: ProductRatePlan[Product],
      price: Price,
      saving: Option[Int],
  ) = {
    val promotionSummaries: List[PromotionSummary] = for {
      promotion <- promotions
      country <- countryGroup.defaultCountry.orElse(countryGroup.countries.headOption)
      validPromotion <- promotionService
        .validatePromotion(
          promotion,
          country,
          productRatePlan.id,
          isRenewal = false,
        )
        .toOption // Not dealing with renewals for now
    } yield getPromotionSummary(validPromotion, price, productRatePlan.billingPeriod)

    price.currency -> PriceSummary(
      price.value,
      saving,
      price.currency,
      productRatePlan.readerType == Gift,
      promotionSummaries,
    )
  }

  private def getPromotionSummary(promotionWithCode: PromotionWithCode, price: Price, billingPeriod: BillingPeriod) = {
    import promotionWithCode._
    PromotionSummary(
      name = promotion.name,
      description = promotion.description,
      promoCode = promoCode,
      discountedPrice = promotion.discount.map(getDiscountedPrice(price, _, billingPeriod).value),
      numberOfDiscountedPeriods =
        promotion.discount.flatMap(_.durationMonths).map(getNumberOfDiscountedPeriods(_, billingPeriod)),
      discount = promotion.discount,
      freeTrialBenefit = promotion.freeTrial,
      incentive = promotion.incentive,
      introductoryPrice = promotion.introductoryPrice,
      landingPage = promotion.landingPage,
    )
  }

  private def nestPriceLists(groupedPriceList: GroupedPriceList): CountryGroupPrices =
    removeInvalidPricingOptions(groupedPriceList)
      .foldLeft(Map.empty[FulfilmentOptions, Map[ProductOptions, Map[BillingPeriod, Map[Currency, PriceSummary]]]]) {
        case (acc, ((fulfilment, productOptions, billing), list)) =>
          val existingProducts =
            acc.getOrElse(fulfilment, Map.empty[ProductOptions, Map[BillingPeriod, Map[Currency, PriceSummary]]])
          val existingBillingPeriods =
            existingProducts.getOrElse(productOptions, Map.empty[BillingPeriod, Map[Currency, PriceSummary]])

          val newBillingPeriods = existingBillingPeriods ++ Map(billing -> list)
          val newProducts = existingProducts ++ Map(productOptions -> newBillingPeriods)

          acc ++ Map(fulfilment -> newProducts)
      }

  private def removeInvalidPricingOptions(groupedPriceList: GroupedPriceList) =
    groupedPriceList.filter(_._2.nonEmpty) // eg. Guardian Weekly Domestic rate plans in RestOfTheWorld countries
}

object PriceSummaryService {
  def getDiscountedPrice(
      originalPrice: Price,
      discountBenefit: DiscountBenefit,
      billingPeriod: BillingPeriod,
  ): Price = {
    val scaledDiscount = getDiscountScaledToPeriod(discountBenefit, billingPeriod)
    val multiplier = (100 - scaledDiscount) / 100
    val newPrice = originalPrice.value * multiplier
    originalPrice.copy(value = newPrice.setScale(2, RoundingMode.HALF_DOWN))
  }

  def getNumberOfDiscountedPeriods(discountDuration: Months, billingPeriod: BillingPeriod): Int =
    Math.ceil(discountDuration.getMonths.toDouble / billingPeriod.monthsInPeriod.toDouble).toInt

  def getDiscountScaledToPeriod(discountBenefit: DiscountBenefit, billingPeriod: BillingPeriod): Double = {
    // If the discount period doesn't cover the whole of the billing period (often the case for annual billing)
    // we need to work out the percentage of the period that is covered and adjust the discount accordingly

    // Also if the discount period isn't an exact multiple of the billing period, eg. a five month discount on
    // a quarterly rate plan then we need to scale the discount and spread it over any billing periods affected

    val percentageOfPeriodDiscounted = discountBenefit.durationMonths.fold(1.toDouble) { durationInMonths =>
      durationInMonths.getMonths.toDouble / billingPeriod.monthsInPeriod.toDouble
    }
    val numberOfPeriodsDiscounted = Math.ceil(percentageOfPeriodDiscounted)
    val newDiscountPercent = (discountBenefit.amount * percentageOfPeriodDiscounted) / numberOfPeriodsDiscounted
    BigDecimal(newDiscountPercent).setScale(3, RoundingMode.HALF_DOWN).toDouble
  }
}
