package com.gu.support.catalog

import io.circe.{Decoder, Encoder, KeyDecoder, KeyEncoder}

sealed trait FulfilmentOptions

case object HomeDelivery extends FulfilmentOptions

case object Collection extends FulfilmentOptions

case object Domestic extends FulfilmentOptions

case object RestOfWorld extends FulfilmentOptions

case object NoFulfilmentOptions extends FulfilmentOptions

object FulfilmentOptions {
  lazy val allFulfilmentOptions = List(HomeDelivery, Collection, Domestic, RestOfWorld, NoFulfilmentOptions)

  def fromString(code: String): Option[FulfilmentOptions] =
    allFulfilmentOptions.find(_.getClass.getSimpleName == s"$code$$")

  implicit val decoder: Decoder[FulfilmentOptions] =
    Decoder.decodeString.emap(code => fromString(code).toRight(s"unrecognised fulfilment options '$code'"))

  implicit val encoder: Encoder[FulfilmentOptions] = Encoder.encodeString.contramap[FulfilmentOptions](_.toString)

  implicit val keyEncoder: KeyEncoder[FulfilmentOptions] = (fulfilmentOptions: FulfilmentOptions) =>
    fulfilmentOptions.toString

  implicit val keyDecoder: KeyDecoder[FulfilmentOptions] = (key: String) => fromString(key)
}
