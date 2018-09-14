package com.gu.acquisition.model

case class GAData(
  hostname: Option[String], // Used to distinguish the site that this conversion comes from this helps with GA views
  clientIp: Option[String], // allows GA to to compute all the geo / network dimensions.
  clientUserAgent: Option[String] // allows GA to compute the browser, platform, and mobile capabilities dimensions.
)

object GAData {

  import io.circe._
  import io.circe.generic.semiauto._

  implicit val decoder: Decoder[GAData] = deriveDecoder
  implicit val encoder: Encoder[GAData] = deriveEncoder
}
