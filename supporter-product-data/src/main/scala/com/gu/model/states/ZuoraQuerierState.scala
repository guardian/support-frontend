package com.gu.model.states

import com.gu.model.zuora.request.ExportZoqlQueryObject
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder


case class ZuoraQuerierState(
  query: ExportZoqlQueryObject
)

object ZuoraQuerierState {
  implicit val decoder: Decoder[ZuoraQuerierState] = deriveDecoder
}
