package com.gu.support.catalog

import io.circe.{Decoder, Encoder}

sealed trait ProductOptions[+T <: Product] {
  def isNoneType = false
}

case object NoProductOptions extends ProductOptions[GuardianWeekly.type with DigitalPack.type with Contribution.type]{
  override def isNoneType = true
}

case object Saturday extends ProductOptions[Paper.type]

case object SaturdayPlus extends ProductOptions[Paper.type]

case object Sunday extends ProductOptions[Paper.type]

case object SundayPlus extends ProductOptions[Paper.type]

case object Weekend extends ProductOptions[Paper.type]

case object WeekendPlus extends ProductOptions[Paper.type]

case object SixdayPlus extends ProductOptions[Paper.type]

case object Sixday extends ProductOptions[Paper.type]

case object EverydayPlus extends ProductOptions[Paper.type]

case object Everyday extends ProductOptions[Paper.type]

object ProductOptions {
  def fromString(code: String) = List(Saturday, SaturdayPlus, Sunday, SundayPlus, Weekend, WeekendPlus, Sixday, SixdayPlus, Everyday, EverydayPlus)
    .find(_.getClass.getSimpleName == s"$code$$")

  implicit val decode: Decoder[ProductOptions[_]] =
    Decoder.decodeString.emap(code => fromString(code).toRight(s"unrecognised product options '$code'"))
  implicit val encode: Encoder[ProductOptions[_]] = Encoder.encodeString.contramap[ProductOptions[_]](_.toString)

  implicit class Extensions[+T <: Product](productOptions: ProductOptions[T]) {
    def toOption = if (productOptions.isNoneType){
      None
    } else {
      Some(productOptions)
    }
  }
}




