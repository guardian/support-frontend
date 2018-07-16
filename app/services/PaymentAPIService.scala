package services

import java.io.IOException

import io.circe.generic.JsonCodec
import io.circe.parser.parse
import codecs.CirceDecoders.decodeErrorWrapper
import play.api.libs.json._
import play.api.libs.ws.{WSClient, WSResponse}
import services.ExecutePaymentBody._
import monitoring.SafeLogger

import scala.concurrent.{ExecutionContext, Future}

class PaymentApiError extends Exception

case class StripeApiError(exceptionType: Option[String], responseCode: Option[Int], requestId: Option[String], message: String) extends PaymentApiError() {
  override val getMessage: String = message
}

case class PaypalApiError(responseCode: Option[Int], errorName: Option[String], message: String) extends PaymentApiError {
  override val getMessage: String = message
}

case class ErrorWrapper(error: PaymentApiError, responseType: String)

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

  private def postData(data: ExecutePaymentBody, queryStrings: Map[String, Seq[String]], isTestUser: Boolean) = {
    val allQueryParams = if (isTestUser) queryStrings + ("mode" -> Seq("test")) else queryStrings

    wsClient.url(payPalExecutePaymentEndpoint)
      .withQueryStringParameters(convertQueryString(allQueryParams): _*)
      .withHttpHeaders("Accept" -> "application/json")
      .withBody(Json.toJson(data))
      .withMethod("POST")
      .execute()
  }

  def getPaypalApiError(body: String): Option[PaymentApiError] = {
    val bodyJson = parse(body)
    val error = bodyJson.toOption
    val paypalApiError = error.flatMap(json => decodeErrorWrapper(json.hcursor).toOption)
    paypalApiError.map(_.error)
  }

  def showAsSuccessful(response: WSResponse): Boolean = {
    response match {
      case response: WSResponse if response.status == 200 => true
      case response: WSResponse if response.status == 400 => {
        val error = getPaypalApiError(response.body)
        PartialFunction.cond(error) {
          case Some(err: PaypalApiError) => err.errorName.contains("PAYMENT_ALREADY_DONE")
        }
      }
      case _ => false
    }
  }

  def execute(
    paymentJSON: JsObject,
    acquisitionData: JsValue,
    queryStrings: Map[String, Seq[String]],
    email: Option[String],
    isTestUser: Boolean
  )(implicit ec: ExecutionContext): Future[Boolean] = {
    val data = ExecutePaymentBody(email, acquisitionData, paymentJSON)
    postData(data, queryStrings, isTestUser).map(response => showAsSuccessful(response))
  }
}
