package com.gu.support.workers

case class RequestInfo(testUser: Boolean, failed: Boolean, messages: List[String]) {
  def appendMessage(message: String): RequestInfo = copy(messages = messages :+ message)
}

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object RequestInfo {
  implicit val codec: Codec[RequestInfo] = deriveCodec
}
