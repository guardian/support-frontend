package com.gu.support.encoding

import io.circe.Decoder._
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedObjectEncoder
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe._
import shapeless.Lazy
import StringExtensions._
import JsonHelpers._

class Codec[T](enc: Encoder[T], dec: Decoder[T]) extends Encoder[T] with Decoder[T] {
  override def apply(a: T): Json = enc.apply(a)

  override def apply(c: HCursor): Result[T] = dec.apply(c)
}

object Codec
{

  def deriveCodec[A](implicit decode: Lazy[DerivedDecoder[A]], encode: Lazy[DerivedObjectEncoder[A]]): Codec[A] =
    new Codec(deriveEncoder, deriveDecoder)

  def capitalizingCodec[A](implicit decode: Lazy[DerivedDecoder[A]], encode: Lazy[DerivedObjectEncoder[A]]): Codec[A] =
    new Codec(capitalizingEncoder, decapitalizingDecoder)

  def decapitalizingDecoder[A](implicit decode: Lazy[DerivedDecoder[A]]): Decoder[A] =
    deriveDecoder[A].prepare(
      _.withFocus(
        _.mapObject(decapitalizeFields)
      )
    )

  def capitalizingEncoder[A](implicit encode: Lazy[DerivedObjectEncoder[A]]): ObjectEncoder[A] =
    deriveEncoder[A].mapJsonObject(capitalizeFields)

  def capitalizeFields(jsonObject: JsonObject): JsonObject = jsonObject.mapKeys(_.capitalize)

  def decapitalizeFields(jsonObject: JsonObject): JsonObject = jsonObject.mapKeys(_.decapitalize)
}
