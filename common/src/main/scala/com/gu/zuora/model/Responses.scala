package com.gu.zuora.model

sealed trait ZuoraResponse {
  def success: Boolean
}

case class ZuoraErrorResponse(success: Boolean, Errors: List[ZuoraError]) extends Throwable with ZuoraResponse

case class ZuoraError(Code: String, Message: String)

case class BasicInfo(
  id: String,
  name: String,
  accountNumber: String,
  notes: Option[String],
  status: String,
  crmId: String,
  batch: String,
  invoiceTemplateId: String,
  communicationProfileId: Option[String])

case class GetAccountResponse(success: Boolean, basicInfo: BasicInfo) extends ZuoraResponse

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
  success: Boolean) extends ZuoraResponse

case class InvoiceResult(invoice: List[Invoice])

case class Invoice(invoiceNumber: String, id: String)