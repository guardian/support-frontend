package com.gu.support.promotions

case class PromotionWithCode(promoCode: PromoCode, promotion: Promotion)

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

object PromotionWithCode {
  implicit val decoder: Decoder[PromotionWithCode] = deriveDecoder
  implicit val encoder: Encoder[PromotionWithCode] = deriveEncoder
}
