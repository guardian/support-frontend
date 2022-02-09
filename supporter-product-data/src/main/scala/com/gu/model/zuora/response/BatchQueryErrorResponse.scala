package com.gu.model.zuora.response

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

case class BatchQueryErrorResponse(
    errorCode: String,
    message: String,
) extends Throwable

case object BatchQueryErrorResponse {
  implicit val decoder: Decoder[BatchQueryErrorResponse] = deriveDecoder
}
