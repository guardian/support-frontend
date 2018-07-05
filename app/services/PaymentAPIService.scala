package services

import java.io.IOException

import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.JsonCodec
import io.circe.parser.parse
import codecs.CirceDecoders._
import play.api.libs.json._
import play.api.libs.ws.{WSClient, WSResponse}
import services.ExecutePaymentBody._

import scala.concurrent.{ExecutionContext, Future}
import monitoring.SafeLogger

case class ExecutePaymentBody(
    signedInUserEmail: Option[String],
    acquisitionData: JsValue,
    paymentData: JsObject
)

@JsonCodec case class PaypalApiError(responseCode: Option[Int], errorName: Option[String], message: String) extends Exception {
  override val getMessage: String = message
}

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

class PaymentAPIService(wsClient: WSClient, paymentAPIUrl: String) extends LazyLogging {

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

  def isPaymentSuccessful(response: WSResponse): Boolean = {
    response match {
      case r: WSResponse => r.status == 200
      case r: WSResponse if r.status == 400 => {
        val paypalAPIError: Option[PaypalApiError] = paypalApiErrorCodec.decodeJson(parse(r.json.toString()).toOption.get).right.toOption
        paypalAPIError match {
          case Some(err) => {
            logger.error(s"PaypalAPIError returned of type: ${err.errorName}")
            err.errorName.contains("PAYMENT_ALREADY_DONE")
          }
          case None => false

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
    postData(data, queryStrings, isTestUser).map(response => isPaymentSuccessful(response))
  }
}
