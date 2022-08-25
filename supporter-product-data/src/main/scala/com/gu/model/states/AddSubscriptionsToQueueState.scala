package com.gu.model.states

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

import java.time.ZonedDateTime

case class AddSubscriptionsToQueueState(
    filename: String,
    recordCount: Int,
    processedCount: Int,
    attemptedQueryTime: ZonedDateTime,
)

object AddSubscriptionsToQueueState {
  implicit val encoder: Encoder[AddSubscriptionsToQueueState] = deriveEncoder
  implicit val decoder: Decoder[AddSubscriptionsToQueueState] = deriveDecoder
}
