package com.gu.support.catalog

import io.circe._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class ZuoraCatalog(
    products: List[ZuoraProduct],
)

case class ZuoraProduct(
    id: String,
    productRatePlans: List[ZuoraProductRatePlan],
)

case class ZuoraProductRatePlan(
    id: String,
    Saving__c: Option[String],
    productRatePlanCharges: List[ZuoraProductRatePlanCharge],
)

case class ZuoraProductRatePlanCharge(
    id: String,
    pricing: List[Price],
)

object ZuoraCatalog {
  implicit val decoderZuoraCatalog: Decoder[ZuoraCatalog] = deriveDecoder
  implicit val decoderZuoraProduct: Decoder[ZuoraProduct] = deriveDecoder
  implicit val decoderZuoraProductRatePlan: Decoder[ZuoraProductRatePlan] = deriveDecoder
  implicit val decoderZuoraProductRatePlanCharge: Decoder[ZuoraProductRatePlanCharge] = deriveDecoder
}
