package com.gu.zuora.model

import io.circe.generic.semiauto.{deriveEncoder, deriveDecoder}
import io.circe.{Decoder, Encoder}

sealed trait ZuoraResponse {
  def success: Boolean
}

object ZuoraError {
  implicit val encoder: Encoder[ZuoraError] = deriveEncoder
  implicit val decoder: Decoder[ZuoraError] = deriveDecoder
}

case class ZuoraError(Code: String, Message: String)

object ZuoraErrorResponse {
  implicit val encoder: Encoder[ZuoraErrorResponse] = deriveEncoder
  implicit val decoder: Decoder[ZuoraErrorResponse] = deriveDecoder
}

case class ZuoraErrorResponse(success: Boolean, Errors: List[ZuoraError]) extends Throwable with ZuoraResponse

object BasicInfo {
  implicit val encoder: Encoder[BasicInfo] = deriveEncoder
  implicit val decoder: Decoder[BasicInfo] = deriveDecoder
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
  implicit val encoder: Encoder[GetAccountResponse] = deriveEncoder
  implicit val decoder: Decoder[GetAccountResponse] = deriveDecoder
}

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
  success: Boolean
) extends ZuoraResponse

case class InvoiceResult(invoice: List[Invoice])

case class Invoice(invoiceNumber: String, id: String)