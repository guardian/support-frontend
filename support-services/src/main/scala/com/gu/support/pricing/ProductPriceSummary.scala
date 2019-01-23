package com.gu.support.pricing

import com.gu.i18n.Currency
import com.gu.support.catalog.{FulfilmentOptions, ProductOptions}
import com.gu.support.promotions.ValidatedPromotion
import com.gu.support.workers.BillingPeriod

case class ProductPriceSummary(
  promotion: ValidatedPromotion,
  prices: Map[FulfilmentOptions, Map[ProductOptions, Map[BillingPeriod, List[PriceSummary]]]]
)

case class PriceSummary(
  price: BigDecimal,
  discountedPrice: Option[BigDecimal],
  currency: Currency
)
