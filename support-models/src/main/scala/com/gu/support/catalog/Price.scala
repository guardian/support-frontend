package com.gu.support.catalog

import com.gu.i18n.Currency
import com.gu.support.encoding.JsonHelpers._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{ACursor, Decoder, Encoder, Json}

case class Price(value: BigDecimal, currency: Currency)

object Price {
  import com.gu.support.encoding.CustomCodecs._
  implicit val decoder: Decoder[Price] = deriveDecoder[Price].prepare(mapFields)

  private def mapFields(c: ACursor) = c.withFocus {
    _.mapObject { jsonObject =>
      jsonObject
        .renameField("price", "value")
        .defaultIfNull("value", Json.fromBigDecimal(0))
    }
  }

  implicit val encoder: Encoder[Price] = deriveEncoder

  implicit class PriceExtensions(price: Price) {
    def update(value: BigDecimal): Price = Price(value, price.currency)
  }
}
