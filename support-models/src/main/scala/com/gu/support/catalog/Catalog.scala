package com.gu.support.catalog

import com.gu.i18n.Currency
import com.gu.support.config.TouchPointEnvironments.{PROD, SANDBOX, UAT}
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
    env <- List(PROD, UAT, SANDBOX)
    plan <- product.ratePlans(env)
  } yield plan.id

  implicit val encoder: Encoder[Catalog] = deriveEncoder
  implicit val decoder: Decoder[Catalog] = deriveDecoder[Catalog].prepare(mapFields)

  private def mapFields(c: ACursor) = c.withFocus { json =>
    val allRatePlans: Seq[Json] = json.\\("productRatePlans").flattenJsonArrays

    val supportedRatePlans = allRatePlans
      .filter(
        _.getField("id")
          .exists(id => productRatePlansWithPrices.exists(fromString(_) == id)),
      )

    val prices = supportedRatePlans.map { productRatePlan =>
      val priceList = sumPriceLists(productRatePlan.\\("pricing"))
      val id = productRatePlan.getField("id").getOrElse(Json.Null)
      val saving = getSaving(productRatePlan)
      Json.obj(
        ("productRatePlanId", id),
        ("savingVsRetail", saving),
        ("prices", Json.fromValues(priceList)),
      )
    }
    Json.obj(("prices", Json.fromValues(prices)))
  }

  def getSaving(json: Json) =
    json
      .getField("Saving__c")
      .getOrElse(Json.fromString("null"))
      .asString
      .getOrElse("null") match {
      case "null" => Json.Null
      case i: String => Json.fromInt(i.toInt)
    }

  def sumPriceLists(priceLists: List[Json]): Iterable[Json] = {
    // Paper products such as Everyday are represented in the catalog as multiple
    // product rate plan charges (one for every day of the week) and these each
    // have their own price list. To get the total prices for these products therefore
    // we need to sum all of the price lists
    priceLists.flattenJsonArrays
      .flatMap(_.as[Price].toOption) // convert the Json to Price objects as they're easier to work with
      .groupBy(_.currency)
      .map(sumPrices)
      .map({ case (_, price) => price.asJson }) // convert back to Json
  }

  def sumPrices(currencyPrices: (Currency, Seq[Price])): (Currency, Price) = currencyPrices match {
    case (currency, priceList) =>
      (currency, priceList.reduceLeft((p1, p2) => Price(p1.value + p2.value, currency)))
  }
}
