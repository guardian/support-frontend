package com.gu.support.catalog

case class Product(
  id: ProductId,
  name: String,
  productRatePlans: List[ProductRatePlan]
)

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object Product {
  implicit val codec: Codec[Product] = deriveCodec
}
