package com.gu.support.catalog

import io.circe._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class ZuoraCatalog(
    products: Array[ZuoraProduct],
)

case class ZuoraProduct(
    id: String,
    productRatePlans: Array[ZuoraProductRatePlan],
)

case class ZuoraProductRatePlan(
    id: String,
    Saving__c: Option[String],
    productRatePlanCharges: Array[ZuoraProductRatePlanCharge],
)

case class ZuoraProductRatePlanCharge(
    id: String,
    pricing: Array[Price],
)

object ZuoraCatalog {
  implicit val decoderZuoraCatalog: Decoder[ZuoraCatalog] = deriveDecoder
  implicit val decoderZuoraProduct: Decoder[ZuoraProduct] = deriveDecoder
  implicit val decoderZuoraProductRatePlan: Decoder[ZuoraProductRatePlan] = deriveDecoder
  implicit val decoderZuoraProductRatePlanCharge: Decoder[ZuoraProductRatePlanCharge] = deriveDecoder
}
