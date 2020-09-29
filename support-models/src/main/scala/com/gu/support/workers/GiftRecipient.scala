package com.gu.support.workers

import cats.implicits._
import com.gu.i18n.Title
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.workers.GiftRecipient.{DigiSub, Weekly}
import io.circe._
import io.circe.syntax._

sealed trait GiftRecipient {
  val giftRecipientType: String
  val firstName: String
  val lastName: String
  def asDigiSub: Option[DigiSub]
  def asWeekly: Option[Weekly]
}
object GiftRecipient {

  implicit val c1: Codec[Weekly] = deriveCodec
  implicit val c2: Codec[DigiSub] = deriveCodec

  implicit val encoder: Encoder[GiftRecipient] = Encoder.instance {
    case c: Weekly => c.asJson
    case c: DigiSub => c.asJson
  }

  def or[A, AA >: A](da: => Decoder[A], daa: => Decoder[AA]): Decoder[AA] = new Decoder[AA] {
    final def apply(c: HCursor): Decoder.Result[AA] = da(c) match {
      case r @ Right(_) => r
      case Left(failure)      => daa(c).leftMap(secondFail => DecodingFailure(failure.message + " / " + secondFail.message, failure.history ++ secondFail.history))
    }
  }

  implicit val decoder: Decoder[GiftRecipient] =
    or(Decoder[Weekly], Decoder[DigiSub].widen)

  case class Weekly(
    title: Option[Title],
    firstName: String,
    lastName: String,
    email: Option[String],
    giftRecipientType: String = "Weekly"
  ) extends GiftRecipient {
    override def asDigiSub: Option[DigiSub] = None

    override def asWeekly: Option[Weekly] = Some(this)
  }
  case class DigiSub(
    firstName: String,
    lastName: String,
    email: String,
    giftMessage: Option[String],
    giftRecipientType: String = "DigiSub"
  ) extends GiftRecipient {
    override def asDigiSub: Option[DigiSub] = Some(this)

    override def asWeekly: Option[Weekly] = None
  }

  //  implicit val encoder: Encoder[ProductReaderType] = Encoder.instance {
  //    case Other => Json.obj("productReaderType" -> Json.fromString("Other"))
  //    case c: WeeklyGift => c.asJson.asObject.map(_.add("productReaderType", Json.fromString("WeeklyGift"))).asJson
  //    case c: DigiSubGift => c.asJson.asObject.map(_.add("productReaderType", Json.fromString("DigiSubGift"))).asJson
  //  }
  //
  //  implicit val decoder: Decoder[ProductReaderType] = Decoder.instance { cursor =>
  //    for {
  //      discriminator <- cursor.downField("productReaderType").as[String]
  //      result <- discriminator match {
  //        case "WeeklyGift" => Decoder[WeeklyGift].widen(cursor)
  //        case "DigiSubGift" => Decoder[DigiSubGift].widen(cursor)
  //        case "Other" => Right(Other)
  //      }
  //    } yield result
  //  }

}
