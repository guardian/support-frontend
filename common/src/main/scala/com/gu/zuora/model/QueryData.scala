package com.gu.zuora.model

import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.deriveCodec

object QueryData {
  implicit val codec: Codec[QueryData] = deriveCodec
}

case class QueryData(queryString: String)
