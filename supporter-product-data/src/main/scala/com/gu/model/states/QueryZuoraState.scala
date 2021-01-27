package com.gu.model.states

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder


case class QueryZuoraState(
)

object QueryZuoraState {
  implicit val decoder: Decoder[QueryZuoraState] = deriveDecoder
}
