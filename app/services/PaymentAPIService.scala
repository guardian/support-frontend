package services

import java.io.IOException

import play.api.libs.json._
import play.api.libs.ws.{WSClient, WSResponse}
import services.ExecutePaymentBody._

import scala.concurrent.{ExecutionContext, Future}

case class ExecutePaymentBody(
    signedInUserEmail: Option[String],
    acquisitionData: Option[JsValue],
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

  private val createPaymentPath = "/contribute/one-off/paypal/create-payment"
  private val executePaymentPath = "/contribute/one-off/paypal/execute-payment"

  val payPalCreatePaymentEndpoint: String = s"$paymentAPIUrl$createPaymentPath"
  val payPalExecutePaymentEndpoint: String = s"$paymentAPIUrl$executePaymentPath"

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

  def execute(
    paymentJSON: JsObject,
    acquisitionData: Option[JsValue],
    queryStrings: Map[String, Seq[String]],
    email: Option[String],
    isTestUser: Boolean
  )(implicit ec: ExecutionContext): Future[Boolean] = {
    val data = ExecutePaymentBody(email, acquisitionData, paymentJSON)
    postData(data, queryStrings, isTestUser).map(_.status == 200)
  }
}
