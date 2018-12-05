package com.gu.support.catalog

case class PaperPrices(
  collection: List[PricePlan],
  delivery: List[PricePlan]
)

object PaperPrices {
  def empty: PaperPrices = PaperPrices(List.empty, List.empty)
}
