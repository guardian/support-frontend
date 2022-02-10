package com.gu.support.encoding

import com.gu.support.encoding.JsonHelpers._
import com.gu.support.encoding.StringExtensions._
import io.circe.Decoder._
import io.circe._
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedAsObjectEncoder
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import shapeless.Lazy

class Codec[T](enc: Encoder[T], dec: Decoder[T]) extends Encoder[T] with Decoder[T] {
  override def apply(a: T): Json = enc.apply(a)

  override def apply(c: HCursor): Result[T] = dec.apply(c)
}

object Codec {

  def deriveCodec[A](implicit decode: Lazy[DerivedDecoder[A]], encode: Lazy[DerivedAsObjectEncoder[A]]): Codec[A] =
    new Codec(deriveEncoder, deriveDecoder)

  def capitalizingCodec[A](implicit
      decode: Lazy[DerivedDecoder[A]],
      encode: Lazy[DerivedAsObjectEncoder[A]],
  ): Codec[A] =
    new Codec(capitalizingEncoder, decapitalizingDecoder)

  def decapitalizingDecoder[A](implicit decode: Lazy[DerivedDecoder[A]]): Decoder[A] =
    deriveDecoder[A].prepare(
      _.withFocus(
        _.mapObject(decapitalizeFields),
      ),
    )

  def capitalizingEncoder[A](implicit encode: Lazy[DerivedAsObjectEncoder[A]]): Encoder.AsObject[A] =
    deriveEncoder[A].mapJsonObject(capitalizeFields)

  def capitalizeFields(jsonObject: JsonObject): JsonObject = jsonObject.mapKeys(_.capitalize)

  def decapitalizeFields(jsonObject: JsonObject): JsonObject = jsonObject.mapKeys(_.decapitalize)
}
