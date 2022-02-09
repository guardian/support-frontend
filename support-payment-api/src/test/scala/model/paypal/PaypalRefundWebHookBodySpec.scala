package model.paypal

import java.util.UUID

import org.scalatest.EitherValues
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class PaypalRefundWebHookBodySpec extends AnyWordSpec with Matchers with EitherValues {

  def compressEvent(event: String): String =
    io.circe.parser.parse(event).fold(_ => "something went wrong! unable to compress event!", _.noSpaces)

  def buildEvent(eventType: String, parentPayment: String): String =
    s"""
       |{
       |    "id": "**********",
       |    "event_version": "1.0",
       |    "create_time": "2018-05-09T15:42:18.935Z",
       |    "resource_type": "refund",
       |    "event_type": "$eventType",
       |    "summary": "A GBP 1.1 GBP sale payment was refunded",
       |    "resource": {
       |        "id": "**********",
       |        "state": "completed",
       |        "amount": {
       |            "total": "1.10",
       |            "currency": "GBP"
       |        },
       |        "refund_to_payer": {
       |            "value": "1.10",
       |            "currency": "GBP"
       |        },
       |        "parent_payment": "$parentPayment",
       |        "sale_id": "**********",
       |        "create_time": "2018-05-09T15:42:14Z",
       |        "update_time": "2018-05-09T15:42:14Z",
       |        "links": [
       |            {
       |                "href": "https://api.paypal.com/v1/payments/refund/**********",
       |                "rel": "self",
       |                "method": "GET"
       |            },
       |            {
       |                "href": "https://api.paypal.com/v1/payments/payment/**********",
       |                "rel": "parent_payment",
       |                "method": "GET"
       |            },
       |            {
       |                "href": "https://api.paypal.com/v1/payments/sale/**********",
       |                "rel": "sale",
       |                "method": "GET"
       |            }
       |        ],
       |        "refund_reason_code": "REFUND"
       |    },
       |    "links": [
       |        {
       |            "href": "https://api.paypal.com/v1/notifications/webhooks-events/**********",
       |            "rel": "self",
       |            "method": "GET"
       |        },
       |        {
       |            "href": "https://api.paypal.com/v1/notifications/webhooks-events/**********/resend",
       |            "rel": "resend",
       |            "method": "POST"
       |        }
       |    ]
       |}
     """.stripMargin

  def testPaymentId(): String = UUID.randomUUID.toString

  "A Paypal event" when {

    "it is a sale refund event" should {

      "be successfully decoded" in {

        val paymentId = testPaymentId()
        val event = buildEvent("PAYMENT.SALE.REFUNDED", paymentId)

        val body = io.circe.parser.decode[PaypalRefundWebHookBody](event).right.value

        body.parentPaymentId mustEqual paymentId
        body.rawBody mustEqual compressEvent(event)
      }
    }

    "it is a capture refund event" should {

      "be successfully decoded" in {

        val paymentId = testPaymentId()
        val event = buildEvent("PAYMENT.CAPTURE.REFUNDED", paymentId)

        val body = io.circe.parser.decode[PaypalRefundWebHookBody](event).right.value

        body.parentPaymentId mustEqual paymentId
        body.rawBody mustEqual compressEvent(event)
      }
    }

    "it is neither a sale nor capture refund event" should {

      "not be able to be successfully decoded" in {

        val paymentId = testPaymentId()
        val event = buildEvent("PAYMENT.SALE.COMPLETED", paymentId)

        val body = io.circe.parser.decode[PaypalRefundWebHookBody](event).left.value

        body.getMessage mustEqual
          "event type PAYMENT.SALE.COMPLETED is not a valid refund event type: DownField(event_type)"
      }
    }
  }
}
