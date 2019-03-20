package com.gu.support.workers.states

import cats.syntax.functor._
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.workers.states.WireFields.{DirectDebitWirePaymentMethodDisplayFields, PaymentMethodDisplayFieldsWire, JustTypeWirePaymentMethodDisplayFields}
import io.circe.syntax._
import io.circe.{Decoder, Encoder, HCursor, Json}

sealed trait PaymentMethodDisplayFields{
  def `type`: String
}

sealed trait JustTypePaymentMethodDisplayFields extends PaymentMethodDisplayFields

case object CreditCardDisplayFields extends JustTypePaymentMethodDisplayFields{
  override val `type` = "CreditCardReferenceTransaction"
}
case object PaypalDisplayFields extends JustTypePaymentMethodDisplayFields{
  override val `type` = "Paypal"
}
case class DirectDebitDisplayFields(
                                          bankAccountNumberMask: String,
                                          bankSortCode: String,
                                          bankAccountName: String,
                                          mandateId: Option[String],
                                        ) extends PaymentMethodDisplayFields {
  val `type`: String = "BankTransfer"

}

object WireFields {

  sealed trait PaymentMethodDisplayFieldsWire {
    def `type`: String
  }
  case class JustTypeWirePaymentMethodDisplayFields(`type`: String) extends PaymentMethodDisplayFieldsWire

  case class DirectDebitWirePaymentMethodDisplayFields(
                                            bankAccountNumberMask: String,
                                            bankSortCode: String,
                                            bankAccountName: String,
                                            mandateId: Option[String],
                                          `type`: String = "BankTransfer"
                                          ) extends PaymentMethodDisplayFieldsWire {

  }

  object PaymentMethodDisplayFieldsWire {
    implicit val JustWireFieldsCodec: Codec[JustTypeWirePaymentMethodDisplayFields] = deriveCodec
    implicit val DirectDebitWirePaymentFields: Codec[DirectDebitWirePaymentMethodDisplayFields] = deriveCodec

    //Payment Methods are details from the payment provider
    implicit val encodePaymentMethodDisplayFieldsWires: Encoder[PaymentMethodDisplayFieldsWire] = Encoder.instance {
      case p:JustTypeWirePaymentMethodDisplayFields => p.asJson
      case d:DirectDebitWirePaymentMethodDisplayFields => d.asJson
    }

    implicit val decodePaymentFieldsWires: Decoder[PaymentMethodDisplayFieldsWire] =
      List[Decoder[PaymentMethodDisplayFieldsWire]](
        Decoder[DirectDebitWirePaymentMethodDisplayFields].widen,
        Decoder[JustTypeWirePaymentMethodDisplayFields].widen,
      ).reduceLeft(_ or _)

  }

}

object PaymentMethodDisplayFields{

  implicit val encode: Encoder[PaymentMethodDisplayFields] = new Encoder[PaymentMethodDisplayFields] {
    final def apply(fields: PaymentMethodDisplayFields): Json =  fields match {
      case d:DirectDebitDisplayFields => DirectDebitWirePaymentMethodDisplayFields(
        bankAccountName = d.bankAccountName,
        bankSortCode = d.bankSortCode,
        bankAccountNumberMask = d.bankAccountNumberMask,
        mandateId = d.mandateId
      ).asJson

     case justType:JustTypePaymentMethodDisplayFields => JustTypeWirePaymentMethodDisplayFields(justType.`type`).asJson

    }

  }

  implicit val decode: Decoder[PaymentMethodDisplayFields] = PaymentMethodDisplayFieldsWire.decodePaymentFieldsWires.emap{
    case d:DirectDebitWirePaymentMethodDisplayFields => Right(DirectDebitDisplayFields(
      bankAccountName = d.bankAccountName,
      bankSortCode = d.bankSortCode,
      bankAccountNumberMask = d.bankAccountNumberMask,
      mandateId = d.mandateId
    ))

    case JustTypeWirePaymentMethodDisplayFields(PaypalDisplayFields.`type`) => Right(PaypalDisplayFields)
    case JustTypeWirePaymentMethodDisplayFields(CreditCardDisplayFields.`type`) => Right(CreditCardDisplayFields)
    case JustTypeWirePaymentMethodDisplayFields(invalidType) => Left(s"invalid payment method type: $invalidType")
  }
}
