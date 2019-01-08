package com.gu.support.catalog

import com.gu.i18n.Currency
import com.gu.support.encoding.JsonHelpers._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder, Json}

case class Pricing(
  currency: Currency,
  price: BigDecimal
)

object Pricing {

  import com.gu.support.encoding.CustomCodecs.{decodeCurrency, encodeCurrency}
  implicit val decoder: Decoder[Pricing] = deriveDecoder[Pricing].prepare {
    _.withFocus {
      _.mapObject {
        _.defaultIfNull("price", Json.fromBigDecimal(0))
      }
    }
  }
  implicit val encoder: Encoder[Pricing] = deriveEncoder
}
