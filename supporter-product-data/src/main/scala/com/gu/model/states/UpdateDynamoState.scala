package com.gu.model.states

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

import java.time.ZonedDateTime

case class UpdateDynamoState(
    filename: String,
    recordCount: Int,
    processedCount: Int,
    attemptedQueryTime: ZonedDateTime,
)

object UpdateDynamoState {
  implicit val encoder: Encoder[UpdateDynamoState] = deriveEncoder
  implicit val decoder: Decoder[UpdateDynamoState] = deriveDecoder
}
