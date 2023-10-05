package com.gu.bigqueryAcquisitionsPublisher

import com.gu.support.acquisitions.models.AcquisitionDataRow

case class EventBridgeEvent(
    detail: AcquisitionDataRow,
)

object EventBridgeEvent {
  import io.circe.generic.semiauto._
  import io.circe.{Decoder, Encoder}

  implicit val eventBridgeEventDecoder: Decoder[EventBridgeEvent] = deriveDecoder[EventBridgeEvent]
  implicit val eventBridgeEventEncoder: Encoder[EventBridgeEvent] = deriveEncoder[EventBridgeEvent]
}
