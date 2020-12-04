package com.gu.support.workers

import io.circe.Json

case class JsonWrapper(state: Json, error: Option[ExecutionError], requestInfo: RequestInfo)

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object JsonWrapper {
  implicit val codec: Codec[JsonWrapper] = deriveCodec
}
