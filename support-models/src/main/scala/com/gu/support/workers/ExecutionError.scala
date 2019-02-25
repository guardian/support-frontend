package com.gu.support.workers

case class ExecutionError(Error: String, Cause: String)

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object ExecutionError {
  implicit val codec: Codec[ExecutionError] = deriveCodec
}
