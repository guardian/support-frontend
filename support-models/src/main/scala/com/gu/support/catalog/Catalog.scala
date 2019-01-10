package com.gu.support.catalog

import com.gu.support.encoding.JsonHelpers._
import io.circe._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Catalog(
  prices: List[Pricelist]
)

object Catalog {
  lazy val productRatePlansWithPrices: List[ProductRatePlanId] =
    List(DigitalPack.ratePlans, Paper.ratePlans, GuardianWeekly.ratePlans).flatten.map(_.id)

  implicit val encoder: Encoder[Catalog] = deriveEncoder
  implicit val decoder: Decoder[Catalog] = deriveDecoder[Catalog].prepare(mapFields)

  private def mapFields(c: ACursor) = c.withFocus { json =>
    val productRatePlans: List[Json] = json.\\("productRatePlans")
      .foldLeft(List[Json]()) {
        (acc: List[Json], element: Json) =>
          val expanded = element.asArray.getOrElse(Nil)
          acc ++ expanded.toList
      }

    val active = productRatePlans.filter(_.getField("id")
        .exists(id => productRatePlansWithPrices.exists(Json.fromString(_) == id)))

    val converted = active.map {
      productRatePlan =>
        productRatePlan.mapObject {
          jsonObject =>
            val pricing = jsonObject("productRatePlanCharges")
              .flatMap { json =>
                json.\\("pricing").headOption
              }
              .getOrElse(Json.Null)

            jsonObject
              .renameField("id", "productRatePlanId")
              .add("prices", pricing)
        }

    }
    Json.fromJsonObject(JsonObject.singleton("prices", Json.fromValues(converted)))
  }
}
