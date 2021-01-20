package com.gu.model.states

import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder

case class ZuoraResultsFetcherEndState(
  filename: String,
  recordCount: Integer
)

object ZuoraResultsFetcherEndState{
  implicit val encoder: Encoder[ZuoraResultsFetcherEndState] = deriveEncoder
}
