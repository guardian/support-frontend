package com.gu.support.catalog

import com.gu.support.workers.BillingPeriod

case class ProductRatePlan[+T <: Product](
  id: ProductRatePlanId,
  billingPeriod: BillingPeriod,
  fulfilmentOptions: FulfilmentOptions,
  productOptions: ProductOptions
)
