package com.gu.model.states

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

import java.time.LocalDate

case class ZuoraResultsFetcherState(
  date: LocalDate,
  jobId: String
)

object ZuoraResultsFetcherState {
  implicit val encoder : Encoder[ZuoraResultsFetcherState] = deriveEncoder
  implicit val decoder : Decoder[ZuoraResultsFetcherState] = deriveDecoder
}
