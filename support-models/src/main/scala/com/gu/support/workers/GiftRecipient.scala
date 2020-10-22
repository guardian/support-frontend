package com.gu.support.workers

import com.gu.i18n.Title
import com.gu.support.encoding.Codec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import io.circe.Decoder.Result
import io.circe._
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedAsObjectEncoder
import io.circe.generic.semiauto._
import io.circe.syntax._
import org.joda.time.LocalDate
import shapeless.Lazy

import scala.reflect.ClassTag

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

case class GeneratedGiftCode private(value: String) extends AnyVal

object GeneratedGiftCode {

  def apply(value: String): Option[GeneratedGiftCode] =
    Some(value)
      .filter(_.matches(raw"""gd(03|06|12)-[a-km-z02-9]{8}"""))
      .map(new GeneratedGiftCode(_))

  implicit val e1 = Encoder.encodeString.contramap[GeneratedGiftCode](_.value)
  implicit val d1 = Decoder.decodeString.emap(GeneratedGiftCode(_).toRight("invalid gift code"))

}

class DiscriminatedType[TOPLEVEL](discriminatorFieldName: String) {

  def getSingle[A](list: List[A]): A = list match {
    case Nil => throw new RuntimeException("not all subtypes covered")
    case a :: Nil => a
    case _ => throw new RuntimeException("duplicate encoder class")
  }

  def encoder(allCodecs: List[this.VariantCodec[_ <: TOPLEVEL]]): Encoder[TOPLEVEL] = Encoder.instance { toplevel =>
    getSingle(allCodecs.flatMap(_.maybeEncode(toplevel)))
  }
  def decoder(allCodecs: List[this.VariantCodec[_ <: TOPLEVEL]]): Decoder[TOPLEVEL] = Decoder.instance { cursor =>
    for {
      discriminator <- cursor.downField(discriminatorFieldName).as[String]
      result <- getSingle(allCodecs.flatMap(_.maybeDecode(discriminator, cursor)))
    } yield result
  }

  def codec(allCodecs: List[this.VariantCodec[_ <: TOPLEVEL]]): Codec[TOPLEVEL] = {
    new Codec[TOPLEVEL](encoder(allCodecs), decoder(allCodecs))
  }

  def variant[A: ClassTag](discriminatorValue: String)(implicit
    decoder: Lazy[DerivedDecoder[A]],
    encoder: Lazy[DerivedAsObjectEncoder[A]]
  ): VariantCodec[A] = new VariantCodec[A](discriminatorValue)

  class VariantCodec[A: ClassTag](discriminatorValue: String)(implicit decode: Lazy[DerivedDecoder[A]], encode: Lazy[DerivedAsObjectEncoder[A]])
    extends Decoder[A] with Encoder[A] {

    private val encoder = deriveEncoder[A].mapJson(_.asObject.map(_.add(discriminatorFieldName, Json.fromString(discriminatorValue))).asJson)
    private val decoder = deriveDecoder[A] // doesn't (re)check the discrim - fix?

    def maybeDecode(actualDiscriminator: String, cursor: HCursor): Option[Result[A]] =
      if (actualDiscriminator == discriminatorValue) Some(apply(cursor)) else None
    def maybeEncode(t: TOPLEVEL): Option[Json] =
      implicitly[ClassTag[A]].unapply(t).map(apply)

    override def apply(c: HCursor): Result[A] = decoder(c)

    override def apply(a: A): Json = encoder(a)

  }

}
