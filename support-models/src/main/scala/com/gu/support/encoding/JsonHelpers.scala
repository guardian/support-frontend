package com.gu.support.encoding

import com.gu.support.promotions.{DiscountBenefit, FreeTrialBenefit, IncentiveBenefit}
import io.circe.{ACursor, Json, JsonObject}

object JsonHelpers {

  implicit class CursorExtensions(cursor: ACursor) {
    def renameField(from: String, to: String) = cursor.withFocus(_.mapObject(_.renameField(from, to)))
  }

  implicit class JsonObjectExtensions(jsonObject: JsonObject) {
    def renameField(from: String, to: String) =
      jsonObject.copyField(from, to).remove(from)

    def copyField(from: String, to: String) =
      jsonObject(from)
        .map(json => jsonObject.add(to, json))
        .getOrElse(jsonObject)

    def updateField(key: String, json: Json) =
      jsonObject
        .remove(key)
        .add(key, json)

    def removeIfNull(key: String) =
      jsonObject(key)
        .filter(_ == Json.Null)
        .map(_ => jsonObject.remove(key))
        .getOrElse(jsonObject)

    def defaultIfNull(key: String, default: Json) =
      jsonObject(key)
        .filter(_ == Json.Null)
        .map(_ => jsonObject.remove(key))
        .map(_ => jsonObject.add(key, default))
        .getOrElse(jsonObject)

    def checkKeyExists(key: String, default: Json) =
      if (jsonObject.contains(key))
        jsonObject
      else
        jsonObject.add(key, default)

    def mapKeys(f: String => String): JsonObject = {
      //ignore intelliJ, this is needed!
      import cats.implicits._

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
    def flattenJsonArrays = jsonList.foldLeft(List[Json]()) {
      (acc: List[Json], element: Json) =>
        val expanded = element.asArray.getOrElse(Nil)
        acc ++ expanded.toList
    }
  }

  implicit class JsonExtensions(json: Json) {
    def getField(key: String) = json.hcursor.downField(key).focus
  }

}
