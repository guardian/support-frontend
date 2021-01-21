package com.gu.model.states

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class ZuoraResultsFetcherEndState(
  filename: String,
  recordCount: Int
)

object ZuoraResultsFetcherEndState{
  implicit val encoder: Encoder[ZuoraResultsFetcherEndState] = deriveEncoder
  implicit val decoder: Decoder[ZuoraResultsFetcherEndState] = deriveDecoder
}
