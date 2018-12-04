package com.gu.support.catalog

import com.gu.i18n.Currency
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec

case class Pricing(
  currency: Currency,
  price: Double
)

object Pricing {

  import com.gu.support.encoding.CustomCodecs.{decodeCurrency, encodeCurrency}

  implicit val codec: Codec[Pricing] = deriveCodec
}
