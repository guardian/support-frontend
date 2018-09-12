package services

import io.circe.parser.decode
import models.PaymentAPIResponse
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.json._
import play.api.libs.ws.{WSClient, WSResponse}
import services.ExecutePaymentBody._
import codecs.CirceDecoders._

import scala.concurrent.{ExecutionContext, Future}

case class PaypalExecuteSuccessResponse(email: Option[String])

case class PayPalError(responseCode: Option[Int], errorName: Option[String], message: String)

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

  def decodePaymentResponse(response: WSResponse): Option[PaymentAPIResponse[PayPalError, PaypalExecuteSuccessResponse]] = {
    decode[PaymentAPIResponse[PayPalError, PaypalExecuteSuccessResponse]](response.body).fold(
      failure => {
        SafeLogger.error(scrub"Unable to decode payment API response: ${response.body}. Message is ${failure.getMessage}")
        None
      },
      resp => {
        resp.error.foreach(logErrorResponse)
        Some(resp)
      }
    )
  }

  def logErrorResponse(error: PayPalError): Unit = {
    if (error.errorName.contains("INSTRUMENT_DECLINED")) {
      SafeLogger.info("Paypal payment failed with 'INSTRUMENT_DECLINED' response.")
    } else {
      SafeLogger.error(scrub"Paypal payment failed due to ${error.errorName} error. Full message: ${error.message}")
    }
  }

  def executePaypalPayment(
    paymentJSON: JsObject,
    acquisitionData: JsValue,
    queryStrings: Map[String, Seq[String]],
    email: Option[String],
    isTestUser: Boolean
  )(implicit ec: ExecutionContext): Future[Option[PaymentAPIResponse[PayPalError, PaypalExecuteSuccessResponse]]] = {
    val data = ExecutePaymentBody(email, acquisitionData, paymentJSON)
    postPaypalData(data, queryStrings, isTestUser).map(decodePaymentResponse)
  }
}
