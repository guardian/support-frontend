package com.gu.model.zuora.response

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class BatchQueryResponse(
  id: String,
  status: JobStatus,
)

object BatchQueryResponse {
  implicit val decoder: Decoder[BatchQueryResponse] = deriveDecoder
}
