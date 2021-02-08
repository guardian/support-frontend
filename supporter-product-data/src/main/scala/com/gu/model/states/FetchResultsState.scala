package com.gu.model.states

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

import java.time.LocalDateTime

case class FetchResultsState(
  jobId: String,
  attemptedQueryTime: LocalDateTime
)

object FetchResultsState {
  implicit val encoder : Encoder[FetchResultsState] = deriveEncoder
  implicit val decoder : Decoder[FetchResultsState] = deriveDecoder
}
