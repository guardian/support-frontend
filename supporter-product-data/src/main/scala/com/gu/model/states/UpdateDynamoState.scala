package com.gu.model.states

import com.gu.model.zuora.request.ExportZoqlQueryObject
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class UpdateDynamoState(
  query: ExportZoqlQueryObject,
  filename: String,
  recordCount: Int
)

object UpdateDynamoState{
  implicit val encoder: Encoder[UpdateDynamoState] = deriveEncoder
  implicit val decoder: Decoder[UpdateDynamoState] = deriveDecoder
}
