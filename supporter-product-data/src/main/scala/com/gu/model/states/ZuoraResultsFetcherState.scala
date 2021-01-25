package com.gu.model.states

import com.gu.model.zuora.request.ExportZoqlQueryObject
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

case class ZuoraResultsFetcherState(
  query: ExportZoqlQueryObject,
  jobId: String
)

object ZuoraResultsFetcherState {
  implicit val encoder : Encoder[ZuoraResultsFetcherState] = deriveEncoder
  implicit val decoder : Decoder[ZuoraResultsFetcherState] = deriveDecoder
}
