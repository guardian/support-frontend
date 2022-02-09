package model.stripe

import io.circe.{Decoder, DecodingFailure}
import io.circe.generic.semiauto.deriveDecoder
import model.PaymentStatus

case class StripeHookObject(
    id: String, // paymentId - equivalent in paypal
    currency: String,
)

object StripeHookObject {
  implicit val stripeHookObjectDecoder: Decoder[StripeHookObject] = deriveDecoder[StripeHookObject]
}

case class StripeHookData(
    `object`: StripeHookObject,
)

object StripeHookData {
  implicit val stripeHookDataDecoder: Decoder[StripeHookData] = deriveDecoder[StripeHookData]
}

case class StripeRefundHook(
    id: String, // eventId, used to validate the event webhook
    `type`: PaymentStatus,
    data: StripeHookData,
)

object StripeRefundHook {

  implicit val paymentStatusDecoder: Decoder[PaymentStatus] = decodePaymentStatus()

  def decodePaymentStatus(): Decoder[PaymentStatus] = Decoder.instance { cursor =>
    cursor.focus
      .map {
        case json if json.isString => {
          json.asString.get match {
            case "charge.refunded" => Right(PaymentStatus.Refunded)
            case _ => Left(DecodingFailure("PaymentStatus", cursor.history))
          }
        }
      }
      .getOrElse {
        Left(DecodingFailure("PaymentStatus", cursor.history))
      }
  }

  implicit val stripeHookDecoder: Decoder[StripeRefundHook] = deriveDecoder[StripeRefundHook]
}
