package com.gu.support.zuora.api.response

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object PaymentMethodDetailResponse {
  implicit val codec: Codec[PaymentMethodDetailResponse] = deriveCodec
}

case class PaymentMethodDetailResponse(
    Id: String,
    FirstName: String,
    UpdatedDate: String,
    Country: String,
    MandateID: String,
    BankTransferType: String,
    AccountId: String,
    LastName: String,
    BankCode: String,
    PaymentMethodStatus: String,
    BankTransferAccountName: String,
    BankTransferAccountNumberMask: String,
    Type: String,
)
