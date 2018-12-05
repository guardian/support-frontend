package com.gu.support.catalog

import io.circe.{Decoder, Json}
import io.circe.generic.semiauto.deriveDecoder
import com.gu.support.encoding.JsonHelpers._

case class ProductRatePlanCharge(
  id: ProductRatePlanChargeId,
  name: String,
  endDateCondition: Option[String],
  pricing: List[Pricing],
  productType: Option[ProductRatePlanChargeType]
)

object ProductRatePlanCharge {
  implicit val productRatePlanChargeDecoder: Decoder[ProductRatePlanCharge] = deriveDecoder[ProductRatePlanCharge].prepare {
    _.withFocus {
      _.mapObject {
        _.removeIfNull("ProductType__c")
          .copyField("ProductType__c", "productType")
      }
    }
  }
}
