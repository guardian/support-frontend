package com.gu.support.catalog

import java.time.DayOfWeek

import io.circe.{Decoder, Encoder}

sealed trait ProductRatePlanChargeType {
  val id: String
}

case object Digipack extends ProductRatePlanChargeType {
  override val id = "Digital Pack"
}

case object Weekly extends ProductRatePlanChargeType {
  override val id = "Guardian Weekly"
}

case object Contributor extends ProductRatePlanChargeType {
  override val id = "Contributor"
}

case object Adjustment extends ProductRatePlanChargeType {
  override val id = "Adjustment"
}

case object Staff extends ProductRatePlanChargeType {
  override val id = "Staff"
}

@deprecated
case object Supporter extends ProductRatePlanChargeType {
  override val id = "Supporter"
}

@deprecated
case object Patron extends ProductRatePlanChargeType {
  override val id = "Patron"
}

@deprecated
case object Partner extends ProductRatePlanChargeType {
  override val id = "Partner"
}

@deprecated
case object Friend extends ProductRatePlanChargeType {
  override val id = "Friend"
}

case class PaperDay(id: String, dayOfWeek: DayOfWeek) extends ProductRatePlanChargeType

object PaperDay {
  val printPattern = "Print\\s(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)".r

  def fromId(id: String) = id match {
    case printPattern(day) => Some(PaperDay(id, DayOfWeek.valueOf(day.toUpperCase)))
    case _ => None
  }
}

object ProductRatePlanChargeType {
  def fromId(id: String): Option[ProductRatePlanChargeType] = {
    PaperDay.fromId(id) orElse
      List(Digipack, Weekly, Adjustment, Contributor, Staff, Supporter, Partner, Patron, Friend)
        .find(_.id == id)
  }

  implicit val decoder: Decoder[ProductRatePlanChargeType] =
    Decoder.decodeString.emap(
      id => fromId(id).toRight{
        s"Unknown ProductRatePlanChargeType: $id"
      }
    )

  implicit val encoder: Encoder[ProductRatePlanChargeType] =
    Encoder.encodeString.contramap[ProductRatePlanChargeType](_.toString)
}
