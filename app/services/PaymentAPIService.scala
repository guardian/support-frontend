package services

import cats.data.EitherT
import monitoring.SafeLogger._
import play.api.libs.json._
import play.api.libs.ws.{WSClient, WSResponse}

import services.ExecutePaymentBody._
import codecs.CirceDecoders._
import io.circe.Decoder
import io.circe.parser.decode
import monitoring.SafeLogger
import cats.implicits._

import scala.concurrent.{ExecutionContext, Future}

case class PayPalSuccess(email: Option[String])

case class PayPalError(responseCode: Option[Int], errorName: Option[String], message: String)

sealed trait PaymentAPIResponseError[+A]

object PaymentAPIResponseError {
  case class DecodingError(error: io.circe.Error) extends PaymentAPIResponseError[Nothing]
  case class ExecuteError(error: Throwable) extends PaymentAPIResponseError[Nothing]
  case class APIError[A](error: A) extends PaymentAPIResponseError[A]
}

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

class PaymentAPIService(wsClient: WSClient, paymentAPIUrl: String)(implicit ec: ExecutionContext) {

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

  private def postPaypalData[A](
    data: ExecutePaymentBody,
    queryStrings: Map[String, Seq[String]],
    isTestUser: Boolean
  ): EitherT[Future, PaymentAPIResponseError[A], WSResponse] = {

    val allQueryParams = if (isTestUser) queryStrings + ("mode" -> Seq("test")) else queryStrings

    wsClient.url(payPalExecutePaymentEndpoint)
      .withQueryStringParameters(convertQueryString(allQueryParams): _*)
      .withHttpHeaders("Accept" -> "application/json")
      .withBody(Json.toJson(data))
      .withMethod("POST")
      .execute()
      .attemptT
      .leftMap(PaymentAPIResponseError.ExecuteError)
  }

  def decodePaymentAPIResponse[A: Decoder, B: Decoder](response: WSResponse): Either[PaymentAPIResponseError[A], B] = {
    implicit def paymentAPIResponseDecoder: Decoder[Either[A, B]] = Decoder.decodeEither[A, B]("error", "data")
    decode[Either[A, B]](response.body).fold(
      err => Left(PaymentAPIResponseError.DecodingError(err)),
      response => response.leftMap(err => PaymentAPIResponseError.APIError(err))
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
  )(implicit ec: ExecutionContext): EitherT[Future, PaymentAPIResponseError[PayPalError], PayPalSuccess] = {
    val data = ExecutePaymentBody(email, acquisitionData, paymentJSON)
    postPaypalData(data, queryStrings, isTestUser) //.map(decodePaymentAPIResponse[PayPalError, PayPalSuccess])
      .subflatMap(decodePaymentAPIResponse[PayPalError, PayPalSuccess])
  }
}
