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

case class SubscribeResponse(AccountNumber : String, SubscriptionNumber: String, Success: Boolean) extends ZuoraResponse