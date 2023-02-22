package com.gu.support.catalog

import com.gu.support.catalog
import com.gu.support.catalog.ProductOptions.{allProductOptions, fromString}
import io.circe.{Decoder, Encoder, KeyDecoder, KeyEncoder}

sealed trait ProductOptions

sealed abstract class PaperProductOptions(val hasDigitalSubscription: Boolean) extends ProductOptions

case object NoProductOptions extends ProductOptions

case object Saturday extends PaperProductOptions(false)

case object SaturdayPlus extends PaperProductOptions(true)

case object Sunday extends PaperProductOptions(false)

case object SundayPlus extends PaperProductOptions(true)

case object Weekend extends PaperProductOptions(false)

case object WeekendPlus extends PaperProductOptions(true)

case object SixdayPlus extends PaperProductOptions(true)

case object Sixday extends PaperProductOptions(false)

case object EverydayPlus extends PaperProductOptions(true)

case object Everyday extends PaperProductOptions(false)

sealed abstract class SupporterPlusVersionOptions extends ProductOptions

case object SupporterPlusV1 extends SupporterPlusVersionOptions

case object SupporterPlusV2 extends SupporterPlusVersionOptions

object ProductOptions {
  val allProductOptions =
    NoProductOptions :: PaperProductOptions.productOptions ++ SupporterPlusVersionOptions.productOptions

  def fromString[T](code: String, productOptions: List[T]): Option[T] =
    productOptions.find(_.getClass.getSimpleName == s"$code$$")

  implicit val decode: Decoder[ProductOptions] =
    Decoder.decodeString.emap(code =>
      fromString(code, allProductOptions).toRight(s"unrecognised product options '$code'"),
    )

  implicit val encode: Encoder[ProductOptions] = Encoder.encodeString.contramap[ProductOptions](_.toString)

  implicit val keyEncoder: KeyEncoder[ProductOptions] = (productOptions: ProductOptions) => productOptions.toString

  implicit val keyDecoder: KeyDecoder[ProductOptions] = (key: String) => fromString(key, allProductOptions)
}

object PaperProductOptions {
  val productOptions: List[PaperProductOptions] =
    List(Saturday, SaturdayPlus, Sunday, SundayPlus, Weekend, WeekendPlus, Sixday, SixdayPlus, Everyday, EverydayPlus)

  implicit val decoder: Decoder[PaperProductOptions] =
    Decoder.decodeString.emap(code => fromString(code, productOptions).toRight(s"unrecognised product options '$code'"))

  implicit val encode: Encoder[PaperProductOptions] = Encoder.encodeString.contramap[PaperProductOptions](_.toString)
}

object SupporterPlusVersionOptions {
  val productOptions: List[SupporterPlusVersionOptions] = List(SupporterPlusV1, SupporterPlusV2)

  implicit val decoder: Decoder[SupporterPlusVersionOptions] =
    Decoder.decodeString.emap(code =>
      fromString(code, productOptions).toRight(s"unrecognised supporter plus version '$code'"),
    )

  implicit val encode: Encoder[SupporterPlusVersionOptions] =
    Encoder.encodeString.contramap[SupporterPlusVersionOptions](_.toString)
}
