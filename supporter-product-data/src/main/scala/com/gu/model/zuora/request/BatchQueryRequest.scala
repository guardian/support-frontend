package com.gu.model.zuora.request

import io.circe.{Encoder, Json}
import io.circe.generic.semiauto.deriveEncoder

import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

case class ZoqlExportQuery(
    name: String,
    query: String,
)

case class BatchQueryRequest(
    partner: String, // Makes the request stateful. See https://knowledgecenter.zuora.com/Central_Platform/API/AB_Aggregate_Query_API/BA_Stateless_and_Stateful_Modes
    incrementalTime: Option[
      ZonedDateTime,
    ], // Sets the time to query from. See https://knowledgecenter.zuora.com/Central_Platform/API/AB_Aggregate_Query_API/B_Submit_Query/e_Post_Query_with_Retrieval_Time
    name: String,
    queries: List[ZoqlExportQuery],
)

object ZoqlExportQuery {
  implicit val encoder: Encoder[ZoqlExportQuery] =
    deriveEncoder[ZoqlExportQuery].mapJsonObject(_.add("type", Json.fromString("zoqlexport")))
}

object BatchQueryRequest {
  implicit val zonedDateTimeEncoder: Encoder[ZonedDateTime] =
    Encoder.encodeString.contramap(
      _.format(
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"), // Zuora insist on this pattern
      ),
    )

  implicit val encoder: Encoder[BatchQueryRequest] = deriveEncoder[BatchQueryRequest].mapJsonObject(
    _.add("format", Json.fromString("csv"))
      .add("version", Json.fromString("1.1"))
      .add("project", Json.fromString("supporter-product-data")) // Also used to make request stateful
      .add("encrypted", Json.fromString("none"))
      .add("useQueryLabels", Json.fromString("true"))
      .add("dateTimeUtc", Json.fromString("true")),
  )
}
