package com.gu.support.workers

case class JsonWrapper(state: String, error: Option[ExecutionError], requestInfo: RequestInfo)

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object JsonWrapper {
  implicit val codec: Codec[JsonWrapper] = deriveCodec
}
