package com.gu.zuora.model.response

import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.deriveCodec

object AccountQueryResponse {
  implicit val codec: Codec[AccountQueryResponse] = deriveCodec
}

object PaymentMethodQueryResponse {
  implicit val codec: Codec[PaymentMethodQueryResponse] = deriveCodec
}

object AccountRecord {
  implicit val codec: Codec[AccountRecord] = deriveCodec
}

object PaymentMethodRecord {
  implicit val codec: Codec[PaymentMethodRecord] = deriveCodec
}

case class AccountQueryResponse(records: List[AccountRecord])

case class PaymentMethodQueryResponse(records: List[PaymentMethodRecord])

case class AccountRecord(AccountNumber: String)

case class PaymentMethodRecord(DefaultPaymentMethodId: String)
