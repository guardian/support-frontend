package com.gu.model.states

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class ZuoraQuerierState()

object ZuoraQuerierState {
  implicit val decoder: Decoder[ZuoraQuerierState] = deriveDecoder
}
