package com.gu.support.zuora.api.response

import com.gu.support.encoding.Codec
import io.circe.parser._
import io.circe.syntax._
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.ErrorJson

sealed trait ZuoraResponse {
  def success: Boolean
}

object ZuoraError {
  implicit val codec: Codec[ZuoraError] = deriveCodec
}

case class ZuoraError(Code: String, Message: String)

object ZuoraErrorResponse {
  implicit val codec: Codec[ZuoraErrorResponse] = capitalizingCodec

  def fromErrorJson(error: ErrorJson): Option[ZuoraErrorResponse] = {
    if (error.errorType == "com.gu.zuora.model.response.ZuoraErrorResponse") {
      decode[List[ZuoraError]](error.errorMessage).map { errors =>
        ZuoraErrorResponse(success = false, errors)
      }.toOption
    } else {
      None
    }
  }
}

case class ZuoraErrorResponse(success: Boolean, errors: List[ZuoraError])
    extends Throwable(errors.asJson.spaces2) with ZuoraResponse {

  override def toString: String = this.errors.toString
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

case class ZuoraAccountNumber(value: String)

case class SubscribeResponseAccount(
    accountNumber: String,
    subscriptionNumber: String,
    totalTcv: Float,
    subscriptionId: String,
    totalMrr: Float,
    accountId: String,
    success: Boolean
) extends ZuoraResponse {

  def domainAccountNumber: ZuoraAccountNumber = ZuoraAccountNumber(accountNumber)
}

object InvoiceResult {
  implicit val codec: Codec[InvoiceResult] = capitalizingCodec
}

case class InvoiceResult(invoice: List[Invoice])

object Invoice {
  implicit val codec: Codec[Invoice] = capitalizingCodec
}

case class Invoice(invoiceNumber: String, id: String)
