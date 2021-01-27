package com.gu.model.zuora.request

import io.circe.{Encoder, Json}
import io.circe.generic.semiauto.deriveEncoder

case class ZoqlExportQuery(
  name: String,
  query: String
)

case class BatchQueryRequest(
  name: String,
  queries: List[ZoqlExportQuery]
)

object ZoqlExportQuery{
  implicit val encoder: Encoder[ZoqlExportQuery] = deriveEncoder[ZoqlExportQuery].mapJsonObject(_
    .add("type", Json.fromString("zoqlexport"))
  )
}

object BatchQueryRequest{
  implicit val encoder: Encoder[BatchQueryRequest] = deriveEncoder[BatchQueryRequest].mapJsonObject(_
    .add("format", Json.fromString("csv"))
    .add("version", Json.fromString("1.1"))
    .add("partner", Json.fromString("guardiannews4398"))  // These parameters make the request stateful
    .add("project", Json.fromString("supporter-product-data")) // see https://knowledgecenter.zuora.com/Central_Platform/API/AB_Aggregate_Query_API/BA_Stateless_and_Stateful_Modes
    .add("encrypted", Json.fromString("none"))
    .add("useQueryLabels", Json.fromString("true"))
    .add("dateTimeUtc", Json.fromString("true"))
  )
}
