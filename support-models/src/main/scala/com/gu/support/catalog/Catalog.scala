package com.gu.support.catalog

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec

case class Catalog(
  products: List[Product]
)

object Catalog {
  implicit val codec: Codec[Catalog] = deriveCodec
}
