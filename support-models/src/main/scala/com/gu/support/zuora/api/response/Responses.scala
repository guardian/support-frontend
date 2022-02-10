package com.gu.support.zuora.api.response

import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs.{decodeLocalTime, encodeLocalTime}
import com.gu.support.encoding.JsonHelpers._
import com.gu.support.encoding.{Codec, ErrorJson}
import com.gu.support.workers.exceptions.{RetryException, RetryNone, RetryUnlimited}
import com.gu.support.zuora.api.PaymentGateway
import io.circe.Decoder.Result
import io.circe.parser._
import io.circe.syntax._
import io.circe.{Decoder, Encoder, HCursor, Json}
import org.joda.time.LocalDate

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
    if (error.errorType == ZuoraErrorResponse.getClass.getCanonicalName) {
      decode[List[ZuoraError]](error.errorMessage).map { errors =>
        ZuoraErrorResponse(success = false, errors)
      }.toOption
    } else {
      None
    }
  }
}

case class ZuoraErrorResponse(success: Boolean, errors: List[ZuoraError])
    extends Throwable(errors.asJson.spaces2)
    with ZuoraResponse {

  override def toString: String = this.errors.toString

  def toRetryNone: RetryNone = new RetryNone(message = this.asJson.noSpaces, cause = this)

  def toRetryUnlimited: RetryUnlimited = new RetryUnlimited(this.asJson.noSpaces, cause = this)

  // Based on https://knowledgecenter.zuora.com/DC_Developers/G_SOAP_API/L_Error_Handling/Errors#ErrorCode_Object
  def asRetryException: RetryException = errors match {
    case List(ZuoraError("API_DISABLED", _)) => toRetryUnlimited
    case List(ZuoraError("LOCK_COMPETITION", _)) => toRetryUnlimited
    case List(ZuoraError("REQUEST_EXCEEDED_LIMIT", _)) => toRetryUnlimited
    case List(ZuoraError("REQUEST_EXCEEDED_RATE", _)) => toRetryUnlimited
    case List(ZuoraError("SERVER_UNAVAILABLE", _)) => toRetryUnlimited
    case List(ZuoraError("UNKNOWN_ERROR", _)) => toRetryUnlimited
    case _ => toRetryNone
  }
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
    communicationProfileId: Option[String],
)

object GetAccountResponse {
  implicit val codec: Codec[GetAccountResponse] = deriveCodec
}

case class GetAccountResponse(success: Boolean, basicInfo: BasicInfo) extends ZuoraResponse

//this response cannot extend ZuoraResponse because this endpoint doesn't return a 'success' boolean field
case class GetObjectAccountResponse(
    IdentityId__c: Option[String],
    sfContactId__c: Option[String],
    CrmId: Option[String],
    DefaultPaymentMethodId: Option[String],
    AutoPay: Boolean,
    Balance: Double,
    Currency: String,
    PaymentGateway: PaymentGateway,
)

object GetObjectAccountResponse {
  implicit val codec: Codec[GetObjectAccountResponse] = deriveCodec
}

sealed trait GetPaymentMethodResponse {
  def `type`: String
  def paymentMethodStatus: String
}

case class GetPaymentMethodDirectDebitResponse(
    `type`: String,
    paymentMethodStatus: String,
    mandateID: String,
    bankTransferAccountName: String,
    bankTransferAccountNumberMask: String,
    bankCode: String,
    firstName: String,
    lastName: String,
    tokenId: String,
) extends GetPaymentMethodResponse

case class GetPaymentMethodCardReferenceResponse(
    `type`: String,
    paymentMethodStatus: String,
    creditCardType: Option[String],
    tokenId: String,
    secondTokenId: String,
    creditCardCountry: Option[String] = None,
    creditCardMaskNumber: String,
    creditCardExpirationYear: Int,
    creditCardExpirationMonth: Int,
) extends GetPaymentMethodResponse

case class GetPaymentMethodPaypalResponse(
    `type`: String,
    paymentMethodStatus: String,
    paypalEmail: String,
    paypalBaid: String,
) extends GetPaymentMethodResponse

object GetPaymentMethodResponse {
  implicit val ddCodec: Codec[GetPaymentMethodDirectDebitResponse] = capitalizingCodec
  implicit val cardCodec: Codec[GetPaymentMethodCardReferenceResponse] = capitalizingCodec
  implicit val payPalCodec: Codec[GetPaymentMethodPaypalResponse] = capitalizingCodec

  implicit val decode: Decoder[GetPaymentMethodResponse] = new Decoder[GetPaymentMethodResponse] {
    override def apply(c: HCursor): Result[GetPaymentMethodResponse] = {
      c.downField("Type").as[String].flatMap {
        case "BankTransfer" => ddCodec(c)
        case "CreditCardReferenceTransaction" => cardCodec(c)
        case "PayPal" => payPalCodec(c)
      }
    }
  }
}

object SubscribeResponseAccount {
  implicit val codec: Codec[SubscribeResponseAccount] = capitalizingCodec
}

case class ZuoraAccountNumber(value: String)
case class ZuoraSubscriptionNumber(value: String)

case class SubscribeResponseAccount(
    accountNumber: String,
    subscriptionNumber: String,
    totalTcv: Float,
    subscriptionId: String,
    totalMrr: Float,
    accountId: String,
    success: Boolean,
) extends ZuoraResponse {
  def domainAccountNumber: ZuoraAccountNumber = ZuoraAccountNumber(accountNumber)
  def domainSubscriptionNumber: ZuoraSubscriptionNumber = ZuoraSubscriptionNumber(subscriptionNumber)
}

object InvoiceResult {
  implicit val codec: Codec[InvoiceResult] = capitalizingCodec
}

case class InvoiceResult(invoice: List[Invoice])

object Invoice {
  implicit val codec: Codec[Invoice] = capitalizingCodec
}

case class Invoice(invoiceNumber: String, id: String)

object InvoiceDataItem {
  implicit val codec: Codec[InvoiceDataItem] = capitalizingCodec
}

case class InvoiceDataItem(invoiceItem: List[Charge])

object Charge {
  implicit val codec: Codec[Charge] = capitalizingCodec
}

case class Charge(serviceStartDate: LocalDate, serviceEndDate: LocalDate, taxAmount: Double, chargeAmount: Double)

object PreviewSubscribeResponse {
  implicit val decoder: Decoder[PreviewSubscribeResponse] = decapitalizingDecoder[PreviewSubscribeResponse].prepare(
    _.withFocus(
      _.mapObject(_.checkKeyExists("InvoiceData", Json.fromValues(Vector[Json]()))),
    ),
  )
  implicit val encoder: Encoder[PreviewSubscribeResponse] = capitalizingEncoder
}

case class PreviewSubscribeResponse(invoiceData: List[InvoiceDataItem], success: Boolean) extends ZuoraResponse

object ZuoraSuccessOrFailureResponse {
  implicit val codec: Codec[ZuoraSuccessOrFailureResponse] = deriveCodec
}

case class ZuoraSuccessOrFailureResponse(success: Boolean, reasons: Option[List[ZuoraErrorReason]]) {
  def errorMessage = reasons.flatMap(_.headOption).map(_.message)
}

object ZuoraErrorReason {
  implicit val codec: Codec[ZuoraErrorReason] = deriveCodec
}

case class ZuoraErrorReason(code: String, message: String)
