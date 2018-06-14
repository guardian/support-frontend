package model.paypal

import com.paypal.base.rest.PayPalRESTException
import scala.collection.JavaConverters._


case class PaypalApiError(responseCode: Option[Int], errorName: Option[String], message: String)

object PaypalApiError {

  def fromString(message: String): PaypalApiError = PaypalApiError(None, None, message)

  def fromThrowable(exception: Throwable): PaypalApiError = exception match {

    case paypalException: PayPalRESTException => {

      val responseCode: Option[Int] = for {
        code <- Option(paypalException.getResponsecode)
      } yield code

      val errorName: Option[String] = for {
        error <- Option(paypalException.getDetails)
        name <- Option(error.getName)
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
