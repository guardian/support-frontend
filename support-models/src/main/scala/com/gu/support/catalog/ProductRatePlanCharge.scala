package com.gu.support.catalog

import com.gu.support.encoding.JsonHelpers._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

case class ProductRatePlanCharge(
  id: ProductRatePlanChargeId,
  name: String,
  endDateCondition: Option[String],
  pricing: List[Pricing],
  productType: Option[ProductRatePlanChargeType]
)

object ProductRatePlanCharge {
  implicit val decoder: Decoder[ProductRatePlanCharge] = deriveDecoder[ProductRatePlanCharge].prepare {
    _.withFocus {
      _.mapObject {
        _.removeIfNull("ProductType__c")
          .copyField("ProductType__c", "productType")
      }
    }
  }
  implicit val encoder: Encoder[ProductRatePlanCharge] = deriveEncoder
}
