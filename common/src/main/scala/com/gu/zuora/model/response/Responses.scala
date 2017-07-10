package com.gu.zuora.model.response

import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.{capitalizingCodec, deriveCodec}
import com.gu.support.workers.exceptions.{RetryException, RetryNone}

sealed trait ZuoraResponse {
  def success: Boolean
}

object ZuoraError {
  implicit val codec: Codec[ZuoraError] = deriveCodec
}

case class ZuoraError(Code: String, Message: String)

object ZuoraErrorResponse {
  implicit val codec: Codec[ZuoraErrorResponse] = capitalizingCodec
}

case class ZuoraErrorResponse(success: Boolean, errors: List[ZuoraError]) extends Throwable with ZuoraResponse {
  def asRetryException: RetryException = new RetryNone(cause = this) //This can be more sophisticated if we get category codes enabled (see error-handling.md)
}

object BasicInfo {
  implicit val codec: Codec[BasicInfo] = deriveCodec
}

case class BasicInfo(
  id: String,
  name: String,
  accountNumber: String,
  notes: Option[String],
  status: String,
  crmId: String,
  batch: String,
  invoiceTemplateId: String,
  communicationProfileId: Option[String]
)

object GetAccountResponse {
  implicit val codec: Codec[GetAccountResponse] = deriveCodec
}

case class GetAccountResponse(success: Boolean, basicInfo: BasicInfo) extends ZuoraResponse

object SubscribeResponseAccount {
  implicit val codec: Codec[SubscribeResponseAccount] = capitalizingCodec
}
case class SubscribeResponseAccount(
  accountNumber: String,
  subscriptionNumber: String,
  gatewayResponse: String,
  paymentId: String,
  invoiceResult: InvoiceResult,
  totalTcv: Int,
  subscriptionId: String,
  totalMrr: Int,
  paymentTransactionNumber: String,
  accountId: String,
  gatewayResponseCode: String,
  invoiceNumber: String,
  invoiceId: String,
  success: Boolean
) extends ZuoraResponse

object InvoiceResult {
  implicit val codec: Codec[InvoiceResult] = capitalizingCodec
}
case class InvoiceResult(invoice: List[Invoice])

object Invoice {
  implicit val codec: Codec[Invoice] = capitalizingCodec
}

case class Invoice(invoiceNumber: String, id: String)