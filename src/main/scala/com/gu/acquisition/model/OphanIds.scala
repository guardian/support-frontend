package com.gu.acquisition.model

import play.api.libs.json.{Reads, Writes, Json => PlayJson}

/**
  * Ids to be included in requests to Ophan.
  */
case class OphanIds(pageviewId: Option[String], visitId: Option[String], browserId: Option[String])

object OphanIds {
  import io.circe._
  import io.circe.generic.semiauto._

  implicit val decoder: Decoder[OphanIds] = deriveDecoder[OphanIds]

  implicit val encoder: Encoder[OphanIds] = deriveEncoder[OphanIds]

  implicit val reads: Reads[OphanIds] = PlayJson.reads[OphanIds]

  implicit val writes: Writes[OphanIds] = PlayJson.writes[OphanIds]

  def syntheticPageviewId: String = {
    import scala.util.Random
    import java.lang.Long

    def base36(long: Long): String = Long.toString(long, 36)

    val length: Int = 20
    val prefix: String = base36(System.currentTimeMillis)
    val suffix: String = "AEP"
    val infix: String = Stream.continually(Random.nextInt(36))
      .map(x => base36(x.toLong))
      .take(length - prefix.length - suffix.length)
      .mkString

    s"$prefix$infix$suffix"
  }
}
