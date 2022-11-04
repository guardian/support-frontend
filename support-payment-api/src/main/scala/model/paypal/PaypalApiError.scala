package model.paypal

import com.paypal.base.rest.PayPalRESTException
import io.circe.generic.JsonCodec
import scala.jdk.CollectionConverters._


// responseCode is the Http status code returned by the Exception.
// See: https://developer.paypal.com/docs/api/overview/#api-responses for details
//
// errorName is the name of the error as defined by Paypal.
// See: https://developer.paypal.com/docs/api/payments/v1/#errors for a list of these names and their meanings.
@JsonCodec case class PaypalApiError(responseCode: Option[Int], errorName: Option[String], message: String)
    extends Exception {
  override val getMessage: String = message
}

object PaypalApiError {

  val paypalErrorText = "Paypal Switch not enabled"

  def fromString(message: String): PaypalApiError = PaypalApiError(None, None, message)

  def fromThrowable(exception: Throwable): PaypalApiError = exception match {

    case paypalException: PayPalRESTException => {

      val responseCode: Option[Int] = for {
        code <- Option(paypalException.getResponsecode)
      } yield code

      // See: https://developer.paypal.com/docs/api/payments/v1/#errors
      val errorName: Option[String] = for {
        details <- Option(paypalException.getDetails)
        name <- Option(details.getName)
        if name != ""
      } yield name

      val error: Option[String] = for {
        error <- Option(paypalException.getDetails)
        message <- Option(error.getMessage)
        if message != ""
      } yield message

      val issue: Option[String] = for {
        error <- Option(paypalException.getDetails)
        detailMessages <- Option(error.getDetails)
        issueMessages = detailMessages.asScala.toList.map(_.getIssue)
        issue = issueMessages.mkString(" - ")
        if issue != ""
      } yield issue

      val errorMessage: String = (error, issue) match {
        case (Some(message), Some(issue)) => s"$message - $issue"
        case (Some(message), _) => s"$message"
        case (_, Some(issue)) => s"$issue"
        case (_, _) => "Unknown error message"
      }

      PaypalApiError(responseCode, errorName, errorMessage)
    }

    case throwable: Throwable => PaypalApiError(None, None, throwable.getMessage)
  }

}
