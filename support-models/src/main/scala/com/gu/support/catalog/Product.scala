package com.gu.support.catalog

case class Product(
  id: ProductId,
  name: String,
  productRatePlans: List[ProductRatePlan]
)
