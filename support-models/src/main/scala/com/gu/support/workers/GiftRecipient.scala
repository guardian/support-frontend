package com.gu.support.workers

import com.gu.i18n.Title
import com.gu.support.encoding.DiscriminatedType
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import io.circe._
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

  val discriminatedType = new DiscriminatedType[GiftRecipient]("giftRecipientType")
  implicit val weeklyCodec = discriminatedType.variant[WeeklyGiftRecipient]("Weekly")
  implicit val dsCodec = discriminatedType.variant[DigitalSubscriptionGiftRecipient]("DigitalSubscription")
  implicit val codec = discriminatedType.codec(List(weeklyCodec, dsCodec))

}

case class GeneratedGiftCode private (value: String) extends AnyVal

object GeneratedGiftCode {

  def apply(value: String): Option[GeneratedGiftCode] =
    Some(value)
      .filter(_.matches(raw"""gd(03|06|12)-[a-km-z02-9]{8}"""))
      .map(new GeneratedGiftCode(_))

  implicit val e1 = Encoder.encodeString.contramap[GeneratedGiftCode](_.value)
  implicit val d1 = Decoder.decodeString.emap(GeneratedGiftCode(_).toRight("invalid gift code"))

}
