package services

import java.io.IOException

import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.JsonCodec
import io.circe.parser.parse
import codecs.CirceDecoders._
import io.circe.{Json, ParsingFailure}
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

@JsonCodec case class MyError(error: String, responseType: String)

object MyError {

  def apply(error: PaypalApiError, responseType: String): MyError = {
    MyError(error, responseType)
  }

  def apply(error: StripeApiError, responseType: String): MyError = {
    MyError(error, responseType)
  }
}

@JsonCodec case class StripeApiError(exceptionType: Option[String], responseCode: Option[Int], requestId: Option[String], message: String) extends Exception {
  override val getMessage: String = message
}

@JsonCodec case class PaypalApiError(responseCode: Option[Int], errorName: Option[String], message: String) extends Exception {
  override val getMessage: String = message
}

//@JsonCodec case class Success[A](data: A)

@JsonCodec case class Error[A](error: A)

object ExecutePaymentBody {
  // implicit val jf: OFormat[ExecutePaymentBody] = Json.format[ExecutePaymentBody]
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
      //.withBody(Json.toJson(data))
      .withMethod("POST")
      .execute()
  }

  def isPaymentSuccessful(response: WSResponse): Boolean = {
    logger.info(s"response returned: ${response.toString}\n" +
      s"\n status: ${response.status}\n" +
      s"body toString: ${response.body}\n" +
      s"body: ${parse(response.json.toString()).toOption.get.asString}")
    response match {
      case r: WSResponse if r.status == 400 => {
        val body = r.body
        logger.info(s"body as string is: ${r.body}")
        val bodyJson = parse(body)
        logger.error(s"parsing bodyJson failure? ${bodyJson.isLeft}  message: ${bodyJson.left.get.message}")
        val errorJsonOpt = bodyJson.right.toOption.flatMap(_.\\("error").headOption)
        val errorJson = errorJsonOpt.getOrElse(Json.Null)
        val apiError = paypalApiErrorCodec.decodeJson(errorJson).toOption
        logger.error(s"apiError is equal to: ${apiError.getOrElse("not defined")}")
        apiError match {
          case Some(err) => {
            logger.error(s"Payment error is PaypalApiError of type ${err.errorName}")
            err.errorName.contains("PAYMENT_ALREADY_DONE")
          }
          case _ => false
        }
      }
      case r: WSResponse => r.status == 200
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
