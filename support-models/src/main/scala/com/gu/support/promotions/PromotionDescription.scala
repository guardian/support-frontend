package com.gu.support.promotions

import com.gu.support.catalog.Price
import com.gu.support.workers.BillingPeriod

case class PromotionDescription(
  description: String,
  discount: Option[DiscountBenefit],
  freeTrial: Option[FreeTrialBenefit],
  incentive: Option[IncentiveBenefit] = None,
  billingPeriod: BillingPeriod,
  originalPrice: Price,
  discountedPrice: Option[Price]
)

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs._

object PromotionDescription {
  implicit val codec: Codec[PromotionDescription] = deriveCodec
}
