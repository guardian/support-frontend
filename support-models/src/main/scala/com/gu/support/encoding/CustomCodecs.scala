package com.gu.support.encoding

import java.util.UUID
import com.gu.i18n.{Country, CountryGroup, Currency, Title}
import io.circe.Decoder.Result
import io.circe.DecodingFailure.Reason.CustomReason
import io.circe.{Decoder, DecodingFailure, Encoder, HCursor, KeyDecoder, KeyEncoder}
import org.joda.time.format.ISODateTimeFormat
import org.joda.time.{DateTime, Days, LocalDate, Months}

import scala.util.Try

object CustomCodecs extends InternationalisationCodecs with HelperCodecs with EitherCodecs

trait InternationalisationCodecs {
  implicit val encodeTitle: Encoder[Title] = Encoder.encodeString.contramap(_.title)
  implicit val decodeTitle: Decoder[Title] =
    Decoder.decodeString.emap(title => Title.fromString(title).toRight(s"Unrecognised title '$title'"))

  implicit val encodeCurrency: Encoder[Currency] = Encoder.encodeString.contramap[Currency](_.iso)

  implicit val decodeCurrency: Decoder[Currency] =
    Decoder.decodeString.emap { code => Currency.fromString(code).toRight(s"Unrecognised currency code '$code'") }

  implicit val currencyKeyEncoder: KeyEncoder[Currency] = (value: Currency) => value.iso

  implicit val currencyKeyDecoder: KeyDecoder[Currency] = (key: String) => Currency.fromString(key)

  implicit val encodeCountryAsAlpha2: Encoder[Country] = Encoder.encodeString.contramap[Country](_.alpha2)
  implicit val decodeCountry: Decoder[Country] =
    Decoder.decodeString.emap { code => CountryGroup.countryByCode(code).toRight(s"Unrecognised country code '$code'") }

  implicit val countryGroupEncoder: Encoder[CountryGroup] = Encoder.encodeString.contramap(_.name)

  implicit val countryGroupDecoder: Decoder[CountryGroup] =
    Decoder.decodeString.emap(id => CountryGroup.byName(id).toRight(s"Unrecognised country group id '$id'"))

  implicit val countryGroupKeyEncoder: KeyEncoder[CountryGroup] = (value: CountryGroup) => value.name.toString

  implicit val countryGroupKeyDecoder: KeyDecoder[CountryGroup] = (key: String) => CountryGroup.byName(key)
}

trait HelperCodecs {
  implicit val dayDecoder: Decoder[Days] = Decoder.decodeInt.map(Days.days)
  implicit val dayEncoder: Encoder[Days] = Encoder.encodeInt.contramap(_.getDays)
  implicit val monthDecoder: Decoder[Months] = Decoder.decodeInt.map(Months.months)
  implicit val monthEncoder: Encoder[Months] = Encoder.encodeInt.contramap(_.getMonths)
  implicit val encodeLocalTime: Encoder[LocalDate] = Encoder.encodeString.contramap(_.toString("yyyy-MM-dd"))
  implicit val decodeLocalTime: Decoder[LocalDate] = Decoder.decodeString.map(LocalDate.parse)
  implicit val uuidDecoder: Decoder[UUID] =
    Decoder.decodeString.emap(code => Try(UUID.fromString(code)).toOption.toRight(s"Invalid UUID '$code'"))
  implicit val uuidEncoder: Encoder[UUID] = Encoder.encodeString.contramap(_.toString)
  object ISODate {
    implicit val encodeDateTime: Encoder[DateTime] = Encoder.encodeString.contramap(ISODateTimeFormat.dateTime().print)
    implicit val decodeDateTime: Decoder[DateTime] = Decoder.decodeString.map(DateTime.parse)
  }
  object MillisDate {
    implicit val encodeDateTime: Encoder[DateTime] = Encoder.encodeLong.contramap(_.getMillis)
    implicit val decodeDateTime: Decoder[DateTime] = Decoder.decodeLong.map(new DateTime(_))
  }
}

trait EitherCodecs {
  import io.circe.syntax._

  implicit def decodeEither[A, B](implicit
      decoderA: Decoder[A],
      decoderB: Decoder[B],
  ): Decoder[Either[A, B]] = {
    import CodecHelpers.withClue
    CodecHelpers.or(withClue(decoderA.map(Left.apply), "Left"), withClue(decoderB.map(Right.apply), "Right"))
  }

  implicit def encodeEither[A, B](implicit
      encoderA: Encoder[A],
      encoderB: Encoder[B],
  ): Encoder[Either[A, B]] = { o: Either[A, B] =>
    o.fold(_.asJson, _.asJson)
  }
}

object CodecHelpers {

  final def withClue[A](a: Decoder[A], message: String): Decoder[A] = new Decoder[A] {
    override def apply(c: HCursor): Result[A] =
      a.apply(c).left.map(err => err.copy(message = message + ": " + err.message))
  }

  final def or[A, AA >: A](leftDecoder: Decoder[A], rightDecoder: => Decoder[AA]): Decoder[AA] = new Decoder[AA] {
    final def apply(hCursor: HCursor): Decoder.Result[AA] = leftDecoder(hCursor) match {
      case success @ Right(_) => success
      case Left(leftFailure) =>
        rightDecoder(hCursor).left.map { rightFailure: DecodingFailure =>
          val leftPart = leftFailure.message + " " + leftFailure.pathToRootString.getOrElse("")
          val rightPart = rightFailure.message + " " + rightFailure.pathToRootString.getOrElse("")
          DecodingFailure(CustomReason(leftPart + s"\n OR " + rightPart), Nil)
        }
    }
  }

}
