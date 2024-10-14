package com.gu.support.catalog

import com.gu.i18n.CountryGroup
import com.gu.support.workers.BillingPeriod
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.Direct

case class ProductRatePlan[+T <: Product](
    id: ProductRatePlanId,
    billingPeriod: BillingPeriod,
    fulfilmentOptions: FulfilmentOptions,
    productOptions: ProductOptions,
    description: String,
    supportedTerritories: List[CountryGroup] = CountryGroup.allGroups,
    readerType: ReaderType = Direct,
)
