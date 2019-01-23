package com.gu.support.pricing

import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.catalog._
import com.gu.support.promotions.PromotionDescriptionService.getDiscountedPrice
import com.gu.support.promotions._
import com.gu.support.workers.BillingPeriod

import scala.collection.immutable
import scala.math.BigDecimal.RoundingMode

class ProductPriceService(promotionService: PromotionService, catalogService: CatalogService) {

  def getPrices[T <: Product](product: T, country: Country, promoCode: Option[PromoCode]): Map[FulfilmentOptions, Map[ProductOptions, Map[BillingPeriod, List[PriceSummary]]]] = {
    val maybePromotion = promoCode.flatMap(promotionService.findPromotion)
    val grouped = product.ratePlans.groupBy(p => (p.fulfilmentOptions, p.productOptions, p.billingPeriod)).map {
      case (keys, productRatePlans) =>
        val priceSummaries = for{
          productRatePlan <- productRatePlans
          price <- catalogService.getPriceList(productRatePlan).map(_.prices).getOrElse(Nil)
        } yield getPriceSummary(maybePromotion, country, productRatePlan.id, price)
//        val priceSummaries = productRatePlans.flatMap(
//          productRatePlan =>
//            catalogService
//              .getPriceList(productRatePlan)
//              .flatMap(_.prices)
//              .map(price => getPriceSummary(maybePromotion, country, productRatePlan.id, price))
//        )
        (keys, priceSummaries)
    }

    nestPriceLists(grouped)
  }

  def getPriceList = Pricelist("", List(Price(1, GBP)))

  private def getPriceSummary(maybePromotion: Option[Promotion], country: Country, productRatePlanId: ProductRatePlanId, price: Price) = {

    val discountedPrice: Option[Price] = for {
      promotion <- maybePromotion
      validPromotion <- promotionService.validatePromotion(promotion, country, productRatePlanId, isRenewal = false).toOption //Not dealing with renewals for now
      discount <- validPromotion.discount
    } yield getDiscountedPrice(price, discount)

    PriceSummary(
      price.value,
      discountedPrice.map(_.value),
      price.currency
    )
  }

  private def nestPriceLists(groupedPriceList: Map[(FulfilmentOptions, ProductOptions, BillingPeriod), List[PriceSummary]]) =
    groupedPriceList
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
