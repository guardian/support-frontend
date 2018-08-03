package services

import java.io.IOException

import io.circe.parser.decode
import codecs.CirceDecoders.paymentApiError
import monitoring.SafeLogger
import play.api.libs.json._
import play.api.libs.ws.{WSClient, WSResponse}
import services.ExecutePaymentBody._

import scala.concurrent.{ExecutionContext, Future}

case class PayPalError(responseCode: Option[Int], errorName: Option[String], message: String)

case class PaymentApiError(error: PayPalError)

case class ExecutePaymentBody(
    signedInUserEmail: Option[String],
    acquisitionData: JsValue,
    paymentData: JsObject
)

object ExecutePaymentBody {
  implicit val jf: OFormat[ExecutePaymentBody] = Json.format[ExecutePaymentBody]
}

object PaymentAPIService {
  case class Email(value: String)
  object Email {
    def fromResponse(resp: WSResponse): Either[Throwable, Option[Email]] =
      if (resp.status == 200) {
        Right((resp.json \ "email").validate[String].asOpt.map(Email.apply))
      } else {
        Left(new IOException(resp.toString))
      }
  }
}

class PaymentAPIService(wsClient: WSClient, paymentAPIUrl: String) {

  private val paypalCreatePaymentPath = "/contribute/one-off/paypal/create-payment"
  private val paypalExecutePaymentPath = "/contribute/one-off/paypal/execute-payment"
  private val stripeExecutePaymentPath = "/contribute/one-off/stripe/execute-payment"

  val payPalCreatePaymentEndpoint: String = s"$paymentAPIUrl$paypalCreatePaymentPath"
  val payPalExecutePaymentEndpoint: String = s"$paymentAPIUrl$paypalExecutePaymentPath"
  val stripeExecutePaymentEndpoint: String = s"$paymentAPIUrl$stripeExecutePaymentPath"

  private def convertQueryString(queryString: Map[String, Seq[String]]): List[(String, String)] = {
    queryString.foldLeft(List.empty[(String, String)]) {
      case (list, (key, values)) => list ::: values.map(x => (key, x)).toList
    }
  }

  private def postPaypalData(data: ExecutePaymentBody, queryStrings: Map[String, Seq[String]], isTestUser: Boolean) = {
    val allQueryParams = if (isTestUser) queryStrings + ("mode" -> Seq("test")) else queryStrings

    wsClient.url(payPalExecutePaymentEndpoint)
      .withQueryStringParameters(convertQueryString(allQueryParams): _*)
      .withHttpHeaders("Accept" -> "application/json")
      .withBody(Json.toJson(data))
      .withMethod("POST")
      .execute()
  }

  def decodePaymentResponse(response: WSResponse): Option[PaymentApiError] = {
    decode[PaymentApiError](response.body).fold(
      failure => {
        val failureMessage = SafeLogger.LogMessage(
          s"Unable to decode PaymentAPIError: ${response.body}. Message is ${failure.getMessage}",
          "Unable to decode PaymentAPIError. See logs for details"
        )
        SafeLogger.error(failureMessage)
        None
      },
      resp => {
       Some(resp)
      }
    )
  }

  def logErrorResponse(paymentApiError: Option[PaymentApiError]): Unit = {
    paymentApiError.foreach(err => {
      val errorMessage = SafeLogger.LogMessage(
        s"Paypal payment failed due to ${err.error.errorName} error. Full message: ${err.error.message}",
        "Paypal payment failed due to error. See logs for full details"
      )
      SafeLogger.error(errorMessage)
    })
  }

  def isDuplicatePaymentResponse(errorOpt: Option[PaymentApiError]): Boolean = {
      errorOpt match {
        case None => false
        case Some(err) => err.error.errorName.contains("PAYMENT_ALREADY_DONE")
      }
  }

  def isSuccessful(response: WSResponse): Boolean = {
    response.status match {
      case 200 => true

      case 400 =>
        val error = decodePaymentResponse(response)
        logErrorResponse(error)
        isDuplicatePaymentResponse(error)

      case _ =>
        val error = decodePaymentResponse(response)
        logErrorResponse(error)
        false
    }
  }

  def executePaypalPayment(
    paymentJSON: JsObject,
    acquisitionData: JsValue,
    queryStrings: Map[String, Seq[String]],
    email: Option[String],
    isTestUser: Boolean
  )(implicit ec: ExecutionContext): Future[Boolean] = {
    val data = ExecutePaymentBody(email, acquisitionData, paymentJSON)
    postPaypalData(data, queryStrings, isTestUser).map(isSuccessful)

  }
}
