package com.gu.model.states

import com.gu.model.Stage
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class ZuoraQuerierState(
  stage: Stage
)

object ZuoraQuerierState {
  implicit val decoder: Decoder[ZuoraQuerierState] = deriveDecoder
}
