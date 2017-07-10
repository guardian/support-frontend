package com.gu.zuora.model.response

import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.deriveCodec

object QueryResponse {
  implicit val codec: Codec[QueryResponse] = deriveCodec
}

object AccountRecord {
  implicit val codec: Codec[AccountRecord] = deriveCodec
}

case class QueryResponse(records : List[AccountRecord])

case class AccountRecord(AccountNumber: String)
