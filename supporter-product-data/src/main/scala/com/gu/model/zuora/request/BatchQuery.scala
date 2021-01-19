package com.gu.model.zuora.request

import io.circe.{Encoder, Json}
import io.circe.generic.semiauto.deriveEncoder

case class ZoqlExportQuery(
  name: String,
  query: String
)

case class BatchQuery(
  name: String,
  queries: List[ZoqlExportQuery]
)

object ZoqlExportQuery{
  implicit val encoder: Encoder[ZoqlExportQuery] = deriveEncoder[ZoqlExportQuery].mapJsonObject(_
    .add("format", Json.fromString("csv"))
    .add("version", Json.fromString("1.0"))
    .add("encrypted", Json.fromString("none"))
    .add("useQueryLabels", Json.fromString("true"))
    .add("dateTimeUtc", Json.fromString("true"))
  )
}

object BatchQuery{
  implicit val encoder: Encoder[BatchQuery] = deriveEncoder[BatchQuery].mapJsonObject(_
    .add("type", Json.fromString("zoqlexport"))
  )
}
