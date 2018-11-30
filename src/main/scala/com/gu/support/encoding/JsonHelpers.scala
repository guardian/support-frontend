package com.gu.support.encoding

import com.gu.support.promotions.{DiscountBenefit, FreeTrialBenefit, IncentiveBenefit}
import io.circe.{Json, JsonObject}

object JsonHelpers {
  implicit class JsonObjectExtensions(jsonObject: JsonObject) {
    def renameField(from: String, to: String) =
      jsonObject(from)
        .map(json => jsonObject.add(to, json).remove(from))
        .getOrElse(jsonObject)

    def checkKeyExists(key: String, default: Json) =
      if(jsonObject.contains(key))
        jsonObject
      else
        jsonObject.add(key, default)

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

  implicit class JsonExtensions(json: Json) {
    def getField(key: String) = json.hcursor.downField(key).focus
  }
}
