package com.gu.support.promotions

import com.gu.support.encoding.JsonHelpers._
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class PromotionCopy(title: Option[String], description: Option[String], roundel: Option[String])

object PromotionCopy {
  implicit val decoder: Decoder[PromotionCopy] =
    deriveDecoder[PromotionCopy].prepare(_.renameField("roundelHtml", "roundel"))
  implicit val encoder: Encoder[PromotionCopy] = deriveEncoder
}
