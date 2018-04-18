package model.paypal

import io.circe.{Decoder, DecodingFailure}
import io.circe.generic.JsonCodec
import io.circe.generic.semiauto.deriveDecoder
import org.joda.time.DateTime
import model.PaymentStatus
import org.joda.time.format.DateTimeFormat
import cats.implicits._

@JsonCodec case class HookAmount(total: BigDecimal, currency: String)

case class Resource(create_time: DateTime, amount: HookAmount, custom: Option[String], parent_payment: String)

object Resource {

  implicit val dateTimeDecoder: Decoder[DateTime] = decodeDateTime()

  def decodeDateTime(): Decoder[DateTime] = Decoder.instance { cursor =>
    cursor.focus.map {
      case json if json.isString => {
        Either.catchNonFatal{
          val format = DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ssZ")
          DateTime.parse(json.asString.get, format)
        }.leftMap(_ => DecodingFailure("DateTime", cursor.history))
      }
    }.getOrElse {
      Left(DecodingFailure("PaymentStatus", cursor.history))
    }
  }


  implicit val resourceDecoder: Decoder[Resource] = deriveDecoder[Resource]
}

case class PaypalRefundHook(event_type: PaymentStatus, resource: Resource)

object PaypalRefundHook {

  implicit val paymentStatusDecoder: Decoder[PaymentStatus] = decodePaymentStatus()

  def decodePaymentStatus(): Decoder[PaymentStatus] = Decoder.instance { cursor =>
    cursor.focus.map {
      case json if json.isString => {
        json.asString.get match {
          case "PAYMENT.SALE.REFUNDED" => Right(PaymentStatus.Refunded)
          case "PAYMENT.CAPTURE.REFUNDED" => Right(PaymentStatus.Refunded)
          case _ => Left(DecodingFailure("PaymentStatus", cursor.history))
        }
      }
    }.getOrElse {
      Left(DecodingFailure("PaymentStatus", cursor.history))
    }
  }

  implicit val webhookEventDecoder: Decoder[PaypalRefundHook] = deriveDecoder[PaypalRefundHook]
}
