package model

import com.gu.support.workers.CheckoutFailureReasons
import com.gu.support.workers.CheckoutFailureReasons.{CheckoutFailureReason, Unknown}
import com.typesafe.scalalogging.StrictLogging
import io.circe.Encoder
import io.circe.generic.semiauto._
import model.stripe.StripeApiError
import play.api.http.Status.{BAD_REQUEST, INTERNAL_SERVER_ERROR, PAYMENT_REQUIRED}
import StripeApiError.recaptchaErrorText

case class CheckoutError(failureReason: CheckoutFailureReason)

object CheckoutError {
  implicit val failureReasonEncoder: Encoder[CheckoutFailureReason] =
    Encoder.encodeString.contramap[CheckoutFailureReason](_.asString)
  implicit val checkoutErrorEncoder: Encoder[CheckoutError] = deriveEncoder[CheckoutError]
}

case class CheckoutErrorResponse(statusCode: Int, checkoutError: CheckoutError)

object CheckoutErrorResponse extends StrictLogging {
  def fromStripeApiError(stripeApiError: StripeApiError): CheckoutErrorResponse = {
    logger.info(s"Stripe API error: ${stripeApiError.getMessage}")

    val checkoutFailureReason = stripeApiError.declineCode
      .flatMap(CheckoutFailureReasons.convertStripeDeclineCode)
      .getOrElse(Unknown)

    val responseCode = checkoutFailureReason match {
      case Unknown if (stripeApiError.message == recaptchaErrorText) =>
        BAD_REQUEST
      case Unknown =>
        logger.error(s"Stripe API error: Unknown checkoutFailureReason for decline code: ${stripeApiError.declineCode}")
        // Something unexpected went wrong when calling Stripe, so we return a 500
        INTERNAL_SERVER_ERROR
      case _ =>
        PAYMENT_REQUIRED // Stripe returned a card exception and we were able to convert the decline code into something meaningful, so we return a 402
    }

    CheckoutErrorResponse(responseCode, CheckoutError(checkoutFailureReason))
  }
}
