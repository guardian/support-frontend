package com.gu.support.catalog

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

case class Product(
  id: ProductId,
  name: String,
  productRatePlans: List[ProductRatePlan]
)

object Product {
  implicit val codec: Codec[Product] = deriveCodec
}
