package com.gu.zuora.model

sealed trait ZuoraResponse {
  def Success: Boolean
}

case class ZuoraErrorResponse(Success: Boolean, Errors: List[ZuoraError]) extends Throwable with ZuoraResponse

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

case class GetAccountResponse(Success: Boolean, basicInfo: BasicInfo) extends ZuoraResponse

case class SubscribeResponseAccount(AccountNumber: String,
                                    SubscriptionNumber: String,
                                    GatewayResponse: String,
                                    PaymentId: String,
                                    InvoiceResult: InvoiceResult,
                                    TotalTcv: Int,
                                    SubscriptionId: String,
                                    TotalMrr: Int,
                                    PaymentTransactionNumber: String,
                                    AccountId: String,
                                    GatewayResponseCode: String,
                                    InvoiceNumber: String,
                                    InvoiceId: String,
                                    Success: Boolean) extends ZuoraResponse

case class InvoiceResult(Invoice: List[Invoice])

case class Invoice(InvoiceNumber: String, Id: String)