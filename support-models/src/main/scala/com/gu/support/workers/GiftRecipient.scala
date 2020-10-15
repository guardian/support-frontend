package com.gu.support.workers

import cats.implicits._
import com.gu.i18n.Title
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import com.gu.support.workers.GiftPurchase.{DigitalSubscriptionGiftPurchase, WeeklyGiftPurchase}
import io.circe._
import io.circe.generic.semiauto._
import io.circe.syntax._
import org.joda.time.LocalDate

sealed trait GiftRecipient {
  val firstName: String
  val lastName: String
  def asDigitalSubscriptionGiftRecipient: Option[DigitalSubscriptionGiftRecipient] =
    this match { case a: DigitalSubscriptionGiftRecipient => Some(a); case _ => None }
  def asWeekly: Option[WeeklyGiftRecipient] = this match { case a: WeeklyGiftRecipient => Some(a); case _ => None }
}
object GiftRecipient {

  case class WeeklyGiftRecipient(
    title: Option[Title],
    firstName: String,
    lastName: String,
    email: Option[String],
  ) extends GiftRecipient

  case class DigitalSubscriptionGiftRecipient(
    firstName: String,
    lastName: String,
    email: String,
    message: Option[String],
    deliveryDate: LocalDate,
  ) extends GiftRecipient

  val circeDiscriminator = new CirceDiscriminator("giftRecipientType")

  private val discriminatorWeekly = "Weekly"
  private val discriminatorDigitalSubscription = "DigitalSubscription"

  implicit val e1 = circeDiscriminator.add(deriveEncoder[WeeklyGiftRecipient], discriminatorWeekly)
  implicit val d1 = deriveDecoder[WeeklyGiftRecipient]
  implicit val e2 = circeDiscriminator.add(deriveEncoder[DigitalSubscriptionGiftRecipient], discriminatorDigitalSubscription)
  implicit val d2 = deriveDecoder[DigitalSubscriptionGiftRecipient]

  implicit val encoder: Encoder[GiftRecipient] = Encoder.instance {
    case c: WeeklyGiftRecipient => c.asJson
    case c: DigitalSubscriptionGiftRecipient => c.asJson
  }

  implicit val decoder: Decoder[GiftRecipient] =
    circeDiscriminator.decode[GiftRecipient](Map(
      discriminatorWeekly -> Decoder[WeeklyGiftRecipient],
      discriminatorDigitalSubscription -> Decoder[DigitalSubscriptionGiftRecipient]
    ))
}

case class GeneratedGiftCode private(value: String) extends AnyVal

object GeneratedGiftCode {

  def apply(value: String): Option[GeneratedGiftCode] =
    Some(value)
      .filter(_.matches(raw"""gd(03|06|12)-[a-km-z02-9]{8}"""))
      .map(new GeneratedGiftCode(_))

  implicit val e1 = Encoder.encodeString.contramap[GeneratedGiftCode](_.value)
  implicit val d1 = Decoder.decodeString.emap(GeneratedGiftCode(_).toRight("invalid gift code"))

}

sealed trait GiftPurchase {
  def asDigitalSubscriptionGiftPurchase: Option[DigitalSubscriptionGiftPurchase] =
    this match { case a: DigitalSubscriptionGiftPurchase => Some(a); case _ => None }
  def giftRecipient: GiftRecipient
}
object GiftPurchase {

  case class WeeklyGiftPurchase(giftRecipient: WeeklyGiftRecipient) extends GiftPurchase
  case class DigitalSubscriptionGiftPurchase(
    giftRecipient: DigitalSubscriptionGiftRecipient,
    giftCode: GeneratedGiftCode,
  ) extends GiftPurchase

  val circeDiscriminator = new CirceDiscriminator("giftPurchaseType")
  private val discriminatorWeekly = "Weekly"
  private val discriminatorDigitalSubscription = "DigitalSubscription"

  implicit val e1 = circeDiscriminator.add(deriveEncoder[WeeklyGiftPurchase], discriminatorWeekly)
  implicit val d1 = deriveDecoder[WeeklyGiftPurchase]
  implicit val e2 = circeDiscriminator.add(deriveEncoder[DigitalSubscriptionGiftPurchase], discriminatorDigitalSubscription)
  implicit val d2 = deriveDecoder[DigitalSubscriptionGiftPurchase]

  implicit val encoder: Encoder[GiftPurchase] = Encoder.instance {
    case c: WeeklyGiftPurchase => c.asJson
    case c: DigitalSubscriptionGiftPurchase => c.asJson
  }

  implicit val decoder =
    circeDiscriminator.decode[GiftPurchase](Map(
      discriminatorWeekly -> Decoder[WeeklyGiftPurchase],
      discriminatorDigitalSubscription -> Decoder[DigitalSubscriptionGiftPurchase]
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
