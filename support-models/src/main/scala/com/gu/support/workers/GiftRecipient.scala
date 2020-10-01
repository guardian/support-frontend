package com.gu.support.workers

import cats.implicits._
import com.gu.i18n.Title
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.GiftRecipient.{DigitalSubGiftRecipient, WeeklyGiftRecipient}
import io.circe._
import io.circe.generic.semiauto._
import io.circe.syntax._

sealed trait GiftRecipient {
  val firstName: String
  val lastName: String
  def asDigiSub: Option[DigitalSubGiftRecipient] = this match { case a: DigitalSubGiftRecipient => Some(a); case _ => None }
  def asWeekly: Option[WeeklyGiftRecipient] = this match { case a: WeeklyGiftRecipient => Some(a); case _ => None }
}
object GiftRecipient {

  case class WeeklyGiftRecipient(
    title: Option[Title],
    firstName: String,
    lastName: String,
    email: Option[String],
  ) extends GiftRecipient

  case class DigitalSubGiftRecipient(
    firstName: String,
    lastName: String,
    email: String,
    message: Option[String],
  ) extends GiftRecipient

  val circeDiscriminator = new CirceDiscriminator("giftRecipientType")

  private val discriminatorWeekly = "Weekly"
  private val discriminatorDigiSub = "DigiSub"

  implicit val e1 = circeDiscriminator.add(deriveEncoder[WeeklyGiftRecipient], discriminatorWeekly)
  implicit val d1 = deriveDecoder[WeeklyGiftRecipient]
  implicit val e2 = circeDiscriminator.add(deriveEncoder[DigitalSubGiftRecipient], discriminatorDigiSub)
  implicit val d2 = deriveDecoder[DigitalSubGiftRecipient]

  implicit val encoder: Encoder[GiftRecipient] = Encoder.instance {
    case c: WeeklyGiftRecipient => c.asJson
    case c: DigitalSubGiftRecipient => c.asJson
  }

  implicit val decoder: Decoder[GiftRecipient] =
    circeDiscriminator.decode[GiftRecipient](Map(
      discriminatorWeekly -> Decoder[WeeklyGiftRecipient],
      discriminatorDigiSub -> Decoder[DigitalSubGiftRecipient]
    ))
}

class CirceDiscriminator(discriminatorFieldName: String) {

  def add[A](encoder: Encoder[A], value: String): Encoder[A] =
    encoder.mapJson(_.asObject.map(_.add(discriminatorFieldName, Json.fromString(value))).asJson)

  def decode[A](all: Map[String, Decoder[_ <: A]]): Decoder[A] =
    Decoder.instance { cursor =>
      for {
        discriminator <- cursor.downField(discriminatorFieldName).as[String]
        result <- all.get(discriminator).map(_.widen(cursor))
          .getOrElse(Left(DecodingFailure(s"invalid discriminator: $discriminator", List())))
      } yield result
    }

}
