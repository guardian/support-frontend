package com.gu.support.workers

import com.gu.support.promotions.PromoCode
import io.circe.Codec

case class AppliedPromotion(promoCode: PromoCode, countryGroupId: String)

object AppliedPromotion {
  import io.circe.generic.semiauto._
  implicit val codec: Codec.AsObject[AppliedPromotion] = deriveCodec[AppliedPromotion]
}
