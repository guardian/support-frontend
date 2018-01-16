package com.gu.zuora.model.response

import cats.implicits._
import com.gu.support.workers.encoding.Helpers.{capitalizingCodec, deriveCodec}
import com.gu.support.workers.encoding.{Codec, ErrorJson}
import com.gu.support.workers.exceptions.{RetryException, RetryNone, RetryUnlimited}
import io.circe.parser._
import io.circe.syntax._

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

  def asRetryException: RetryException = errors match {
    case List(ZuoraError("UNKNOWN_ERROR", _)) => new RetryUnlimited(this.asJson.noSpaces, cause = this)
    case _ => new RetryNone(message = this.asJson.noSpaces, cause = this)
  }

  override def toString: String = this.errors.toString()
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
  totalMrr: Float,
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