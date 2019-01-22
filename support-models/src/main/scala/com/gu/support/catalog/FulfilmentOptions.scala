package com.gu.support.catalog

import com.gu.support.catalog.FulfilmentOptions.fromString
import com.gu.support.workers._
import io.circe.{Decoder, Encoder}

sealed trait FulfilmentOptions[+T <: Product]{
  def isNoneType = false
}

case object HomeDelivery extends FulfilmentOptions[Paper.type]

case object Collection extends FulfilmentOptions[Paper.type]

case object Domestic extends FulfilmentOptions[GuardianWeekly.type] {
  //implicit val encoder: Encoder[Domestic.type] = Encoder.encodeString.contramap(_.toString)
}

case object RestOfWorld extends FulfilmentOptions[GuardianWeekly.type]

case object NoFulfilmentOptions extends FulfilmentOptions[DigitalPack.type with Contribution.type]{
  override def isNoneType = true
}

object FulfilmentOptions {
  def fromString(code: String) = List(HomeDelivery, Collection, Domestic, RestOfWorld, NoFulfilmentOptions)
    .find(_.getClass.getSimpleName == s"$code$$")

  implicit val decoder: Decoder[FulfilmentOptions[_]] =
    Decoder.decodeString.emap(code => fromString(code).toRight(s"unrecognised fulfilment options '$code'"))
  implicit val encoder: Encoder[FulfilmentOptions[_]] = Encoder.encodeString.contramap[FulfilmentOptions[_]](_.toString)

  implicit class Extensions[+T <: Product](fulfilmentOptions: FulfilmentOptions[T]) {
    def toOption = if (fulfilmentOptions.isNoneType){
      None
    } else {
      Some(fulfilmentOptions)
    }
  }
}
