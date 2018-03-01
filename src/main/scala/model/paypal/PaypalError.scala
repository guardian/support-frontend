package model.paypal

import com.paypal.api.payments.Error
import com.paypal.base.rest.PayPalRESTException
import enumeratum.{Enum, EnumEntry}
import scala.collection.JavaConverters._

sealed trait PaypalErrorType extends EnumEntry

object PaypalErrorType extends Enum[PaypalErrorType] {
  val values = findValues

  case object ValidationError extends PaypalErrorType

  case object NotFound extends PaypalErrorType

  case object PaymentAlreadyDone extends PaypalErrorType

  case object InstrumentDeclined extends PaypalErrorType

  case object Other extends PaypalErrorType

  def fromPaypalError(error: Error): PaypalErrorType = error.getName match {
    case "VALIDATION_ERROR" => ValidationError
    case "INVALID_RESOURCE_ID" => NotFound
    case "PAYMENT_ALREADY_DONE" => PaymentAlreadyDone
    case "INSTRUMENT_DECLINED" => InstrumentDeclined
    case _ => Other
  }
}

case class PaypalApiError(errorType: PaypalErrorType,
  message: String)

object PaypalApiError {

  def fromString(message: String): PaypalApiError = PaypalApiError(PaypalErrorType.Other, message)

  def fromThrowable(exception: Throwable): PaypalApiError = exception match {

    //-- Error response coming from paypal is totally different. Entire PayPalRESTException contains all items = null
    case paypalException: PayPalRESTException if (paypalException.getResponsecode == 401) => {
      PaypalApiError.fromString("401 - Client Authentication failed")
    }

    case paypalException: PayPalRESTException => {

      val errorOpt: Option[String] = for {
        error <- Option(paypalException.getDetails)
        message <- Option(error.getMessage)
        if message != ""
      } yield message

      val issueOpt: Option[String] = for {
        error <- Option(paypalException.getDetails)
        detailMessages <- Option(error.getDetails)
        issueMessages = detailMessages.asScala.toList.map(_.getIssue)
        issue = issueMessages.mkString(" - ")
        if issue != ""
      } yield issue

      val errorMessage: String = (errorOpt, issueOpt) match {
        case (Some(errorMessage), Some(issueMessage)) => s"${errorMessage} - ${issueMessage}"
        case (Some(errorMessage), _) => s"${errorMessage}"
        case (_, Some(issueMessage)) => s"${issueMessage}"
        case (_, _) => "Unknown error message"
      }

      PaypalApiError(PaypalErrorType.fromPaypalError(paypalException.getDetails), errorMessage)
    }

    case exception: Exception =>
      PaypalApiError.fromString(exception.getMessage)
  }

}
