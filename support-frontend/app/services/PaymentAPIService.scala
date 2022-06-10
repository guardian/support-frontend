package services

import cats.data.EitherT
import com.gu.monitoring.SafeLogger._
import play.api.libs.json._
import play.api.libs.ws.{WSClient, WSResponse}
import services.ExecutePaymentBody._
import io.circe.Decoder
import io.circe.parser.decode
import com.gu.monitoring.SafeLogger
import cats.syntax.all._
import io.circe.generic.semiauto.deriveDecoder

import scala.concurrent.{ExecutionContext, Future}

case class PayPalSuccess(guestAccountCreationToken: Option[String])

object PayPalSuccess {
  implicit val payPalSuccessDecoder: Decoder[PayPalSuccess] = deriveDecoder
}

case class PayPalError(responseCode: Option[Int], errorName: Option[String], message: String)

object PayPalError {
  implicit val payPalErrorBodyDecoder: Decoder[PayPalError] = deriveDecoder
}

sealed trait PaymentAPIResponseError[+A]

object PaymentAPIResponseError {
  case class DecodingError(error: io.circe.Error) extends PaymentAPIResponseError[Nothing]
  case class ExecuteError(error: Throwable) extends PaymentAPIResponseError[Nothing]
  case class APIError[A](error: A) extends PaymentAPIResponseError[A]
}

case class ExecutePaymentBody(
    // TODO: remove this field once the Payment API switches over to use mandatory email field
    signedInUserEmail: Option[String],
    // TODO: question: should we put the email in the paymentData for consistency with Stripe?
    // downside is it breaks the model of "paymentData contains exactly what we need to send to the third-party"
    // since we don't need to send email to PayPal but we do to Stripe
    email: String,
    acquisitionData: JsValue,
    paymentData: JsObject,
)

object ExecutePaymentBody {
  implicit val jf: OFormat[ExecutePaymentBody] = Json.format[ExecutePaymentBody]
}

class PaymentAPIService(wsClient: WSClient, val paymentAPIUrl: String)(implicit ec: ExecutionContext) {

  private val paypalCreatePaymentPath = "/contribute/one-off/paypal/create-payment"
  private val paypalExecutePaymentPath = "/contribute/one-off/paypal/execute-payment"

  val payPalCreatePaymentEndpoint: String = s"$paymentAPIUrl$paypalCreatePaymentPath"
  val payPalExecutePaymentEndpoint: String = s"$paymentAPIUrl$paypalExecutePaymentPath"

  private def postPaypalData[A](
      data: ExecutePaymentBody,
      isTestUser: Boolean,
      userAgent: Option[String],
  ): EitherT[Future, PaymentAPIResponseError[A], WSResponse] = {

    val headers = Seq("Accept" -> "application/json") ++ userAgent.map("User-Agent" -> _)
    val queryStringParameters = if (isTestUser) Seq("mode" -> "test") else Seq()

    wsClient
      .url(payPalExecutePaymentEndpoint)
      .withQueryStringParameters(queryStringParameters: _*)
      .withHttpHeaders(headers: _*)
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
      response => response.leftMap(err => PaymentAPIResponseError.APIError(err)),
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
      email: String,
      isTestUser: Boolean,
      userAgent: Option[String],
  )(implicit ec: ExecutionContext): EitherT[Future, PaymentAPIResponseError[PayPalError], PayPalSuccess] = {
    val data = ExecutePaymentBody(Some(email), email, acquisitionData, paymentJSON)
    postPaypalData(data, isTestUser, userAgent).subflatMap(decodePaymentAPIResponse[PayPalError, PayPalSuccess])
  }
}
