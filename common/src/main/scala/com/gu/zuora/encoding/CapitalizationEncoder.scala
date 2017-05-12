package com.gu.zuora.encoding

import cats.instances.vector._
import com.gu.helpers.StringExtensions._
import io.circe.generic.decoding.DerivedDecoder
import io.circe.generic.encoding.DerivedObjectEncoder
import io.circe.generic.semiauto._
import io.circe.{ Decoder, JsonObject, ObjectEncoder }
import shapeless.Lazy

object CapitalizationEncoder {
  def decapitalizingDecoder[A](implicit decode: Lazy[DerivedDecoder[A]]): Decoder[A] =
    deriveDecoder[A].prepare(
      _.withFocus(
        _.mapObject(decapitalizeFields)
      )
    )

  def capitalizingEncoder[A](implicit encode: Lazy[DerivedObjectEncoder[A]]): ObjectEncoder[A] =
    deriveEncoder[A].mapJsonObject(capitalizeFields)

  def modifyFields(json: JsonObject)(f: String => String): JsonObject = {
    val newFields = json.fields.map(str => f(str)).zip(json.values)
    val newObject = JsonObject.from(newFields)
    newObject
  }

  def capitalizeFields(jsonObject: JsonObject): JsonObject = modifyFields(jsonObject)(_.capitalize)

  def decapitalizeFields(jsonObject: JsonObject): JsonObject = modifyFields(jsonObject)(_.decapitalize)
}
