package com.gu.support.promotions

import com.gu.support.encoding.JsonHelpers._
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class LandingPage(title: Option[String], description: Option[String], roundel: Option[String])

object LandingPage {
  implicit val decoder: Decoder[LandingPage] = deriveDecoder[LandingPage].prepare(_.renameField("roundelHtml", "roundel"))
  implicit val encoder: Encoder[LandingPage] = deriveEncoder
}
