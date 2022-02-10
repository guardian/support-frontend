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
    // productRatePlanChargeId is only needed for GW 6 for 6. If we implemented 6 for 6 in the same way as
    // we do discounts we wouldn't need this and we would be able to apply 6 for 6 to other products
    productRatePlanChargeId: Option[ProductRatePlanChargeId] = None,
    readerType: ReaderType = Direct,
)
