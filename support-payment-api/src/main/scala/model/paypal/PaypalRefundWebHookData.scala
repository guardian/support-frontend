package model.paypal

import io.circe.Decoder
import play.api.mvc.Request

// rawBody used by Paypal SDK to validate web hook event
case class PaypalRefundWebHookBody(parentPaymentId: String, rawBody: String)

object PaypalRefundWebHookBody {

  private sealed trait RefundEvent

  private case object RefundEvent extends RefundEvent {

    // https://developer.paypal.com/docs/integration/direct/webhooks/event-names/
    def validateEventType(eventType: String): Either[String, RefundEvent] = {
      if (eventType == "PAYMENT.SALE.REFUNDED" || eventType == "PAYMENT.CAPTURE.REFUNDED") Right(RefundEvent)
      else Left(s"event type $eventType is not a valid refund event type")
    }

    implicit val refundEventDecoder: Decoder[RefundEvent] = Decoder.decodeString.emap(validateEventType)
  }

  implicit val paypalRefundDataDecoder: Decoder[PaypalRefundWebHookBody] = Decoder.instance { cursor =>
    for {
      // Check event is valid refund event
      _ <- cursor.downField("event_type").as[RefundEvent]
      parentPaymentId <- cursor.downField("resource").downField("parent_payment").as[String]
      // If the for-comprehension has got this far, focusing the cursor should never be None.
      body <- Right(cursor.focus.fold("")(_.noSpaces))
    } yield {
      PaypalRefundWebHookBody(parentPaymentId, body)
    }
  }
}

// headers used by Paypal SDK to validate web hook event
case class PaypalRefundWebHookData(body: PaypalRefundWebHookBody, headers: Map[String, String])

object PaypalRefundWebHookData {

  def fromRequest(request: Request[PaypalRefundWebHookBody]): PaypalRefundWebHookData =
    PaypalRefundWebHookData(request.body, request.headers.toSimpleMap)
}
