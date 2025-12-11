package services

import io.circe.{Json, JsonObject}
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

import scala.jdk.CollectionConverters.{IterableHasAsScala, MapHasAsScala}

/** Utility for converting DynamoDB AttributeValue to Circe Json
  */
object DynamoJsonConverter {

  def toJson(attribute: AttributeValue): Json = {
    if (attribute.hasM()) {
      mapToJson(attribute.m())
    } else if (attribute.hasL()) {
      Json.fromValues(attribute.l().asScala.map(toJson))
    } else if (attribute.hasSs()) {
      Json.fromValues(attribute.ss().asScala.map(Json.fromString))
    } else if (attribute.s() != null) {
      Json.fromString(attribute.s())
    } else if (attribute.n() != null) {
      Json.fromDouble(attribute.n().toDouble).getOrElse(Json.Null)
    } else if (attribute.bool() != null) {
      Json.fromBoolean(attribute.bool())
    } else {
      Json.Null
    }
  }

  def mapToJson(item: java.util.Map[String, AttributeValue]): Json = {
    val jsonMap: Map[String, Json] = item.asScala.view
      .mapValues(toJson)
      .toMap

    Json.fromJsonObject(JsonObject.fromMap(jsonMap))
  }
}
