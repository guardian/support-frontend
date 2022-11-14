package com.gu.support.encoding

import com.gu.support.promotions.{DiscountBenefit, FreeTrialBenefit, IncentiveBenefit, IntroductoryPriceBenefit}
import io.circe.{ACursor, Decoder, Json, JsonObject}

object JsonHelpers {

  implicit class CursorExtensions(cursor: ACursor) {
    def renameField(from: String, to: String): ACursor = {
      cursor.withFocus(_.mapObject(_.renameField(from, to)))
    }
  }

  implicit class JsonObjectExtensions(jsonObject: JsonObject) {
    def renameField(from: String, to: String): JsonObject =
      jsonObject.copyField(from, to).remove(from)

    def copyField(from: String, to: String): JsonObject =
      jsonObject(from)
        .map(json => jsonObject.add(to, json))
        .getOrElse(jsonObject)

    def updateField(key: String, json: Json): JsonObject =
      jsonObject
        .remove(key)
        .add(key, json)

    def unNest(parentKey: String, childKey: String): JsonObject = {
      val newObject = for {
        parent <- jsonObject(parentKey)
        parentObject <- parent.asObject
        child <- parentObject(childKey)
      } yield jsonObject.add(childKey, child)
      newObject.getOrElse(jsonObject)
    }

    def removeIfNull(key: String): JsonObject =
      jsonObject(key)
        .filter(_ == Json.Null)
        .map(_ => jsonObject.remove(key))
        .getOrElse(jsonObject)

    def defaultIfNull(key: String, default: Json): JsonObject =
      jsonObject(key)
        .filter(_ == Json.Null)
        .map(_ => jsonObject.remove(key))
        .map(_ => jsonObject.add(key, default))
        .getOrElse(jsonObject)

    def checkKeyExists(key: String, default: Json): JsonObject =
      if (jsonObject.contains(key))
        jsonObject
      else
        jsonObject.add(key, default)

    def wrapObject(key: String): JsonObject =
      JsonObject.empty.add(key, Json.fromJsonObject(jsonObject))

    def mapKeys(f: String => String): JsonObject = {
      // ignore intelliJ, this is needed!

      val newFields = jsonObject.keys.map(str => f(str)).zip(jsonObject.values)
      val newObject = JsonObject.fromFoldable(newFields.toList)
      newObject
    }

    def extractBenefits: JsonObject = {
      val result = for {
        promotionTypeJson <- jsonObject("promotionType")
        name <- promotionTypeJson.getField("name")
      } yield extractBenefitForType(string(name), promotionTypeJson, jsonObject)

      result.getOrElse(jsonObject)
    }

    private def extractBenefitForType(promotionType: String, json: Json, jsonObject: JsonObject): JsonObject =
      promotionType match {
        case DiscountBenefit.jsonName => jsonObject.add("discount", json)
        case FreeTrialBenefit.jsonName => jsonObject.add("freeTrial", json)
        case IncentiveBenefit.jsonName => jsonObject.add("incentive", json)
        case IntroductoryPriceBenefit.jsonName => jsonObject.add("introductoryPrice", json)
        case "retention" => jsonObject.add("renewalOnly", Json.fromBoolean(true))
        case "tracking" => jsonObject.add("tracking", Json.fromBoolean(true))
        case "double" => extractDouble(json, jsonObject)
      }

    private def extractDouble(json: Json, jsonObject: JsonObject): JsonObject = {
      val result = for {
        a <- json.getField("a")
        b <- json.getField("b")
        aType <- a.getField("name")
        bType <- b.getField("name")
        first <- Option(extractBenefitForType(string(aType), a, jsonObject))
        second <- Option(extractBenefitForType(string(bType), b, first))
      } yield second

      result.getOrElse(jsonObject)
    }

    private def string(json: Json) = json.noSpaces.replace("\"", "")
  }

  implicit class JsonListExtensions(jsonList: List[Json]) {
    def flattenJsonArrays: Seq[Json] = jsonList.foldLeft(List[Json]()) { (acc: List[Json], element: Json) =>
      val expanded = element.asArray.getOrElse(Nil)
      acc ++ expanded.toList
    }
  }

  implicit class JsonExtensions(val json: Json) extends AnyVal {
    def getField(key: String): Option[Json] = json.hcursor.downField(key).focus
  }

  // Decodes an expected json string to T if the given partial function is defined for the string value
  def decodeStringAndCollect[T](pf: PartialFunction[String, T]): Decoder[T] = Decoder.decodeString.emap { s =>
    pf.lift(s)
      .map(Right.apply)
      .getOrElse(Left(s"Unexpected value: $s"))
  }

}
