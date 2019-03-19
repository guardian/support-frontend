package com.gu.support.workers.states

import cats.syntax.functor._
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

sealed trait EmailPaymentFields {
  def description: String
}

case class NonDirectDebitEmailPaymentFields(description: String) extends EmailPaymentFields

case class DirectDebitEmailPaymentFields(
  bankAccountNumberMask: String,
  bankSortCode: String,
  bankAccountName: String,
  mandateId: Option[String]
  ) extends EmailPaymentFields {
  override val description = "Direct Debit"
}


object EmailPaymentFields {
  implicit val NonDirectDebitEmailPaymentFieldsCodec: Codec[NonDirectDebitEmailPaymentFields] = deriveCodec
  implicit val DirectDebitEmailPaymentFieldsCodec: Codec[DirectDebitEmailPaymentFields] = deriveCodec


  //Payment Methods are details from the payment provider
  implicit val encodePaymentFields: Encoder[EmailPaymentFields] = Encoder.instance {
    case p: NonDirectDebitEmailPaymentFields => p.asJson
    case d: DirectDebitEmailPaymentFields => d.asJson
  }

  implicit val decodePaymentFields: Decoder[EmailPaymentFields] =
    List[Decoder[EmailPaymentFields]](
      Decoder[DirectDebitEmailPaymentFields].widen,
      Decoder[NonDirectDebitEmailPaymentFields].widen,
    ).reduceLeft(_ or _)
}
