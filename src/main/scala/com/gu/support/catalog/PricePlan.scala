package com.gu.support.catalog

case class PricePlan(
  id: String,
  name: Option[String],
  pricePerPeriod: List[Pricing]
)
