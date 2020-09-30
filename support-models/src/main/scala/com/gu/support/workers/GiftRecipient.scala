package com.gu.support.workers

import cats.implicits._
import com.gu.i18n.Title
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.GiftRecipient.{DigiSub, Weekly}
import io.circe._
import io.circe.generic.semiauto._
import io.circe.syntax._

sealed trait GiftRecipient {
  val firstName: String
  val lastName: String
  def asDigiSub: Option[DigiSub] = this match { case a: DigiSub => Some(a); case _ => None }
  def asWeekly: Option[Weekly] = this match { case a: Weekly => Some(a); case _ => None }
}
object GiftRecipient {

  case class Weekly(
    title: Option[Title],
    firstName: String,
    lastName: String,
    email: Option[String],
  ) extends GiftRecipient

  case class DigiSub(
    firstName: String,
    lastName: String,
    email: String,
    message: Option[String],
  ) extends GiftRecipient

  val circeDiscriminator = new CirceDiscriminator("giftRecipientType")

  private val discriminatorWeekly = "Weekly"
  private val discriminatorDigiSub = "DigiSub"

  implicit val e1 = circeDiscriminator.add(deriveEncoder[Weekly], discriminatorWeekly)
  implicit val d1 = deriveDecoder[Weekly]
  implicit val e2 = circeDiscriminator.add(deriveEncoder[DigiSub], discriminatorDigiSub)
  implicit val d2 = deriveDecoder[DigiSub]

  implicit val encoder: Encoder[GiftRecipient] = Encoder.instance {
    case c: Weekly => c.asJson
    case c: DigiSub => c.asJson
  }

  implicit val decoder: Decoder[GiftRecipient] =
    circeDiscriminator.decode[GiftRecipient](Map(
      discriminatorWeekly -> Decoder[Weekly],
      discriminatorDigiSub -> Decoder[DigiSub]
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
