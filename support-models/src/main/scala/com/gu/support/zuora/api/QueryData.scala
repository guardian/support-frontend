package com.gu.support.zuora.api
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object QueryData {
  implicit val codec: Codec[QueryData] = deriveCodec
}

case class QueryData(queryString: String)
