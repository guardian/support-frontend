package com.gu.zuora.model

import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.capitalizingCodec

object SubscribeOptions {
  implicit val codec: Codec[SubscribeOptions] = capitalizingCodec
}
case class SubscribeOptions(generateInvoice: Boolean = true, processPayments: Boolean = true)
