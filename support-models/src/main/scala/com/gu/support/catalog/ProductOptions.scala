package com.gu.support.catalog

import com.gu.support.workers.BillingPeriod
import com.gu.support.workers.BillingPeriod.fromString
import io.circe.{Decoder, Encoder, KeyDecoder, KeyEncoder}

sealed trait ProductOptions

case object NoProductOptions extends ProductOptions

case object Saturday extends ProductOptions

case object SaturdayPlus extends ProductOptions

case object Sunday extends ProductOptions

case object SundayPlus extends ProductOptions

case object Weekend extends ProductOptions

case object WeekendPlus extends ProductOptions

case object SixdayPlus extends ProductOptions

case object Sixday extends ProductOptions

case object EverydayPlus extends ProductOptions

case object Everyday extends ProductOptions

object ProductOptions {
  def fromString(code: String) = List(Saturday, SaturdayPlus, Sunday, SundayPlus, Weekend, WeekendPlus, Sixday, SixdayPlus, Everyday, EverydayPlus)
    .find(_.getClass.getSimpleName == s"$code$$")

  implicit val decode: Decoder[ProductOptions] =
    Decoder.decodeString.emap(code => fromString(code).toRight(s"unrecognised product options '$code'"))

  implicit val encode: Encoder[ProductOptions] = Encoder.encodeString.contramap[ProductOptions](_.toString)

  implicit val keyEncoder: KeyEncoder[ProductOptions] = (productOptions: ProductOptions) => productOptions.toString

  implicit val keyDecoder: KeyDecoder[ProductOptions] = (key: String) => fromString(key)
}




