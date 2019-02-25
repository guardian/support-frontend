package com.gu.support.workers

case class SalesforceContactRecord(Id: String, AccountId: String)

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SalesforceContactRecord {
  implicit val codec: Codec[SalesforceContactRecord] = deriveCodec
}
