package com.gu.model.sqs

case class SqsEvent(Records: List[SqsRecord])
import io.circe.Codec
import io.circe.generic.semiauto.deriveCodec

object SqsEvent {
  implicit val codec: Codec[SqsEvent] = deriveCodec
}

case class SqsRecord(body: String)

object SqsRecord {
  implicit val codec: Codec[SqsRecord] = deriveCodec
}
