package com.gu.support.workers

import cats.implicits._
import com.gu.i18n.Title
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.GiftRecipient.{DigitalSubGiftRecipient, WeeklyGiftRecipient}
import com.gu.support.workers.GiftRecipientAndMaybeCode.{DigitalSubGiftRecipientWithCode, NonDigitalSubGiftRecipient}
import io.circe._
import io.circe.generic.semiauto._
import io.circe.syntax._
import org.joda.time.LocalDate

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
    deliveryDate: LocalDate,
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

case class GiftCode private(value: String) extends AnyVal

object GiftCode {

  def apply(value: String): Option[GiftCode] =
    Some(value)
      .filter(_.matches(raw"""gd(03|06|12)-[a-km-z02-9]{8}"""))
      .map(new GiftCode(_))

  implicit val e1 = Encoder.encodeString.contramap[GiftCode](_.value)
  implicit val d1 = Decoder.decodeString.emap(GiftCode(_).toRight("invalid gift code"))

}

sealed trait GiftRecipientAndMaybeCode {
  def asDigiSub: Option[DigitalSubGiftRecipientWithCode] = this match { case a: DigitalSubGiftRecipientWithCode => Some(a); case _ => None }
  def giftRecipient: GiftRecipient
}
object GiftRecipientAndMaybeCode {

  case class NonDigitalSubGiftRecipient(giftRecipient: WeeklyGiftRecipient) extends GiftRecipientAndMaybeCode
  case class DigitalSubGiftRecipientWithCode(
    giftRecipient: DigitalSubGiftRecipient,
    giftCode: GiftCode
  ) extends GiftRecipientAndMaybeCode

  val circeDiscriminator = new CirceDiscriminator("giftRecipientType")
  private val discriminatorNonDigiSub = "NonDigiSub"
  private val discriminatorDigiSub = "DigiSub"

  implicit val e1 = circeDiscriminator.add(deriveEncoder[NonDigitalSubGiftRecipient], discriminatorNonDigiSub)
  implicit val d1 = deriveDecoder[NonDigitalSubGiftRecipient]
  implicit val e2 = circeDiscriminator.add(deriveEncoder[DigitalSubGiftRecipientWithCode], discriminatorDigiSub)
  implicit val d2 = deriveDecoder[DigitalSubGiftRecipientWithCode]

  implicit val encoder: Encoder[GiftRecipientAndMaybeCode] = Encoder.instance {
    case c: NonDigitalSubGiftRecipient => c.asJson
    case c: DigitalSubGiftRecipientWithCode => c.asJson
  }

  implicit val decoder =
    circeDiscriminator.decode[GiftRecipientAndMaybeCode](Map(
      discriminatorNonDigiSub -> Decoder[NonDigitalSubGiftRecipient],
      discriminatorDigiSub -> Decoder[DigitalSubGiftRecipientWithCode]
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
