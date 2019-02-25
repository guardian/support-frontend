package com.gu.support.promotions

case class ValidatedPromotion(promoCode: PromoCode, promotion: Promotion)

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

object ValidatedPromotion {
  implicit val decoder: Decoder[ValidatedPromotion] = deriveDecoder
}
