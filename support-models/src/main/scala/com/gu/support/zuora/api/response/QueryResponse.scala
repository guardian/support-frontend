package com.gu.support.zuora.api.response

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

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

case class AccountRecord(AccountNumber: String, CreatedRequestId__c: Option[String])

case class PaymentMethodRecord(DefaultPaymentMethodId: String)
