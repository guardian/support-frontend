package com.gu.support.zuora.api

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SubscribeOptions {
  implicit val codec: Codec[SubscribeOptions] = capitalizingCodec
}

case class SubscribeOptions(generateInvoice: Boolean = true, processPayments: Boolean = true)
