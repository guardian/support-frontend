package com.gu.support.catalog

import com.gu.i18n.Currency
import com.gu.support.config.TouchPointEnvironments.{PROD, SANDBOX}
import io.circe.Json.fromString
import io.circe._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import com.gu.support.encoding.JsonHelpers._

case class Catalog(
    prices: List[Pricelist],
)

object Catalog {
  lazy val productRatePlansWithPrices: List[ProductRatePlanId] = for {
    product <- List(SupporterPlus, DigitalPack, Paper, GuardianWeekly)
    env <- List(PROD, SANDBOX)
    plan <- product.ratePlans(env)
  } yield plan.id

  implicit val encoder: Encoder[Catalog] = deriveEncoder

  def sumPriceLists(priceLists: List[Price]): List[Price] = {
    // Paper products such as Everyday are represented in the catalog as multiple
    // product rate plan charges (one for every day of the week) and these each
    // have their own price list. To get the total prices for these products therefore
    // we need to sum all of the price lists
    priceLists
      .groupBy(_.currency)
      .map(sumPrices)
      .map({ case (_, price) => price })
      .toList
  }

  def sumPrices(currencyPrices: (Currency, List[Price])): (Currency, Price) = currencyPrices match {
    case (currency, priceList) =>
      (currency, priceList.reduceLeft((p1, p2) => Price(p1.value + p2.value, currency)))
  }

  def convert(zuoraCatalog: ZuoraCatalog): Catalog = {

    // filter rate plans
    val filteredProductRatePlans = zuoraCatalog.products
      .map { _.productRatePlans }
      .flatten
      .filter(ratePlan => productRatePlansWithPrices.exists(_ == ratePlan.id))

    // create list of priceList
    val priceList: List[Pricelist] = filteredProductRatePlans.map { productRatePlan =>
      val ratePlanCharges = productRatePlan.productRatePlanCharges.map { _.pricing }.flatten
      val priceListSum = sumPriceLists(ratePlanCharges)
      val id = productRatePlan.id
      val saving = productRatePlan.Saving__c.map(_.toInt)
      Pricelist(id, saving, priceListSum)
    }

    // Catalog list of prices
    return Catalog(priceList)
  }
}
