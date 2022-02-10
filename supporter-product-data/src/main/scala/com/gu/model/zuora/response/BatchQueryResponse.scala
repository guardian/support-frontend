package com.gu.model.zuora.response

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class BatchQueryItem(
    name: String,
    fileId: Option[String],
    recordCount: Int,
    full: Boolean, // Whether this is a full or incremental export
)

case class BatchQueryResponse(
    id: String,
    status: JobStatus,
    batches: List[BatchQueryItem],
)

object BatchQueryItem {
  implicit val decoder: Decoder[BatchQueryItem] = deriveDecoder
}

object BatchQueryResponse {
  implicit val decoder: Decoder[BatchQueryResponse] = deriveDecoder
}
