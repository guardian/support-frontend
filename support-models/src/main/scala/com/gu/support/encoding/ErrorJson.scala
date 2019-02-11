package com.gu.support.encoding

import com.gu.support.encoding.Codec.deriveCodec

case class ErrorJson(errorMessage: String, errorType: String, stackTrace: List[String], cause: Option[ErrorJson])

object ErrorJson {
  implicit val codec: Codec[ErrorJson] = deriveCodec
}
