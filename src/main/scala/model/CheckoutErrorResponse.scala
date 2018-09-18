package model

import com.gu.support.workers.model.CheckoutFailureReasons
import com.gu.support.workers.model.CheckoutFailureReasons.{CheckoutFailureReason, Unknown}
import io.circe.generic.semiauto._
import io.circe.Encoder
import model.stripe.StripeApiError
import play.api.http.Status.{INTERNAL_SERVER_ERROR, PAYMENT_REQUIRED}

case class CheckoutError(failureReason: CheckoutFailureReason)

object CheckoutError {
  implicit val failureReasonEncoder: Encoder[CheckoutFailureReason] = Encoder.encodeString.contramap[CheckoutFailureReason](_.asString)
  implicit val checkoutErrorEncoder: Encoder[CheckoutError] = deriveEncoder[CheckoutError]
}

case class CheckoutErrorResponse(statusCode: Int, checkoutError: CheckoutError)

object CheckoutErrorResponse {

  def fromStripeApiError(stripeApiError: StripeApiError): CheckoutErrorResponse = {

    val checkoutFailureReason = stripeApiError.declineCode
      .flatMap(CheckoutFailureReasons.convertStripeDeclineCode)
      .getOrElse(Unknown)

    val responseCode = checkoutFailureReason match {
      case Unknown => INTERNAL_SERVER_ERROR //Something unexpected went wrong when calling Stripe, so we return a 500
      case _ => PAYMENT_REQUIRED //Stripe returned a card exception and we were able to convert the decline code into something meaningful, so we return a 402
    }

    CheckoutErrorResponse(responseCode, CheckoutError(checkoutFailureReason))

  }

}
