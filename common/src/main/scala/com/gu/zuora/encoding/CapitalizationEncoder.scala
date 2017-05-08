package com.gu.zuora.encoding

import io.circe.generic.decoding.DerivedDecoder
import io.circe.{Decoder, Encoder, JsonObject, ObjectEncoder}
import io.circe.generic.semiauto._
import com.gu.helpers.StringExtensions._
import cats.instances.vector._
import com.gu.i18n.Currency
import io.circe.generic.encoding.DerivedObjectEncoder
import shapeless.Lazy

object CapitalizationEncoder {
  implicit val encodeCurrency: Encoder[Currency] = Encoder.encodeString.contramap[Currency](_.iso)

  implicit def decapitalizingDecoder[A](implicit decode: Lazy[DerivedDecoder[A]]): Decoder[A] =
    deriveDecoder[A].prepare(
      _.withFocus(
        _.mapObject(decapitalizeFields)
      )
    )

  def capitalizingEncoder[A](implicit encode: Lazy[DerivedObjectEncoder[A]]): ObjectEncoder[A] =
    deriveEncoder[A].mapJsonObject(capitalizeFields)

  def modifyFields(json: JsonObject)(f: String => String): JsonObject = {
    val newFields = json.fields.map(str => f(str)).zip(json.values)
    JsonObject.from(newFields)
  }

  def capitalizeFields(jsonObject: JsonObject): JsonObject = modifyFields(jsonObject)(_.capitalize)

  def decapitalizeFields(jsonObject: JsonObject): JsonObject = modifyFields(jsonObject)(_.decapitalize)
}
