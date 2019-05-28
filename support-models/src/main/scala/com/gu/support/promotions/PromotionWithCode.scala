package com.gu.support.promotions

case class PromotionWithCode(promoCode: PromoCode, promotion: Promotion)

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

object PromotionWithCode {
  implicit val decoder: Decoder[PromotionWithCode] = deriveDecoder
}
