package com.gu.model.states

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

import java.time.ZonedDateTime

case class AddSupporterRatePlanItemToQueueState(
    filename: String,
    recordCount: Int,
    processedCount: Int,
    attemptedQueryTime: ZonedDateTime,
)

object AddSupporterRatePlanItemToQueueState {
  implicit val encoder: Encoder[AddSupporterRatePlanItemToQueueState] = deriveEncoder
  implicit val decoder: Decoder[AddSupporterRatePlanItemToQueueState] = deriveDecoder
}
