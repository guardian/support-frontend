package com.gu.support.catalog

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe._
import com.gu.support.encoding.JsonHelpers._

case class Catalog(
  products: List[Product]
)

object Catalog {
  val supportedProducts: List[ProductId] = List(
    "2c92a0fb4edd70c8014edeaa4ddb21e7", //DP
    "2c92a0fe5aacfabe015ad24bf6e15ff6", //Contributor

  )
  implicit val encoder: Encoder[Catalog] = deriveEncoder
  implicit val decoder: Decoder[Catalog] = deriveDecoder[Catalog].prepare(mapFields)

  private def mapFields(c: ACursor) = c.withFocus {
    _.mapObject { jsonObject =>
      val filteredProducts = jsonObject("products")
        .map(json => json
          .asArray
          .map(filterProducts)
          .getOrElse(json)
        )

      filteredProducts
        .map(jsonObject.updateField("products", _))
        .getOrElse(jsonObject)
    }
  }

  private def filterProducts(products: Vector[Json]) = {
    val filtered = products.filter(isSupportedProduct)
    Json.fromValues(filtered)
  }

  private def isSupportedProduct(productJson: Json) = {
    productJson
      .getField("id")
      .exists{
        idJson =>
          supportedProducts.exists(Json.fromString(_) == idJson)
      }
  }
}
