package com.gu.support.workers.encoding

import com.gu.support.workers.encoding.Helpers.deriveCodec

case class ErrorJson(errorMessage: String, errorType: String, stackTrace: List[String], cause: Option[ErrorJson])

object ErrorJson {
  implicit val codec: Codec[ErrorJson] = deriveCodec
}