package com.gu.support.acquisitions.models

import io.circe.{Decoder, Encoder}

sealed abstract class AcquisitionType(val value: String)

object AcquisitionType {
  case object Purchase extends AcquisitionType("PURCHASE")
  case object Redemption extends AcquisitionType("REDEMPTION")

  def fromString(s: String): AcquisitionType =
    s match {
      case Redemption.value => Redemption
      case _ => Purchase
    }

  implicit val decode: Decoder[AcquisitionType] = Decoder.decodeString.map(code => fromString(code))
  implicit val encod: Encoder[AcquisitionType] = Encoder.encodeString.contramap[AcquisitionType](_.toString)
}
