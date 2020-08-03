package com.gu.support.catalog

import com.gu.support.catalog
import com.gu.support.catalog.ProductOptions.{allProductOptions, fromString}
import io.circe.{Decoder, Encoder, KeyDecoder, KeyEncoder}

sealed trait ProductOptions

sealed trait PaperProductOptions extends ProductOptions

case object NoProductOptions extends ProductOptions

case object Saturday extends PaperProductOptions

case object SaturdayPlus extends PaperProductOptions

case object Sunday extends PaperProductOptions

case object SundayPlus extends PaperProductOptions

case object Weekend extends PaperProductOptions

case object WeekendPlus extends PaperProductOptions

case object SixdayPlus extends PaperProductOptions

case object Sixday extends PaperProductOptions

case object EverydayPlus extends PaperProductOptions

case object Everyday extends PaperProductOptions

object ProductOptions {
  val allProductOptions = NoProductOptions :: PaperProductOptions.productOptions

  def fromString[T](code: String, productOptions: List[T]): Option[T] = productOptions.find(_.getClass.getSimpleName == s"$code$$")

  implicit val decode: Decoder[ProductOptions] =
    Decoder.decodeString.emap(code => fromString(code, allProductOptions).toRight(s"unrecognised product options '$code'"))

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




