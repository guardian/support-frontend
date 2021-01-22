package com.gu.model.states

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class WriteToDynamoState(
  filename: String,
  recordCount: Int
)

object WriteToDynamoState{
  implicit val encoder: Encoder[WriteToDynamoState] = deriveEncoder
  implicit val decoder: Decoder[WriteToDynamoState] = deriveDecoder
}
