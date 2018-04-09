package services

import java.io.IOException

import cats.data.EitherT
import play.api.libs.json.Json
import play.api.libs.ws.{DefaultWSCookie, WSClient, WSResponse}
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

object PaymentAPIService {
  case class Email(value: String)
  object Email {
    def fromResponse(resp: WSResponse): Either[Throwable, Option[Email]] = {
      if (resp.status == 200) {
        Right((resp.json \ "email").validate[String].asOpt.map(Email.apply))
      } else {
        Left(new IOException(resp.toString))
      }
    }
  }
}

class PaymentAPIService(wsClient: WSClient, paymentAPIUrl: String, paymentApiPayPalExecutePaymentPath: String) {
  import PaymentAPIService._

  def convertQueryString(queryString: Map[String, Seq[String]]): List[(String, String)] = {
    queryString.foldLeft(List.empty[(String, String)]) {
      case (list, (key, values)) => list ::: values.map(x => (key, x)).toList
    }
  }

  def execute(request: Request[AnyContent])(implicit req: RequestHeader, ec: ExecutionContext): Future[Boolean] = {
    import cats.syntax.applicativeError._
    import cats.instances.future._

    val endpoint = "/contribute/one-off/paypal/execute-payment"
    val cookieString = request.cookies.get("acquisition_data").get.value
    val acquisitionData = Json.parse(java.net.URLDecoder.decode(cookieString, "UTF-8"))

    val paymentJSON = Json.obj(
      "paymentId" -> request.getQueryString("paymentId").get,
      "payerId" -> request.getQueryString("PayerID").get
    )

    val data = Json.obj(
      "paymentData" -> paymentJSON,
      "acquisitionData" -> acquisitionData
    )

    wsClient.url(s"$paymentAPIUrl$paymentApiPayPalExecutePaymentPath")
      .withQueryStringParameters(convertQueryString(request.queryString): _*)
      .withHttpHeaders("Accept" -> "application/json")
      .withBody(data)
      .withMethod("POST")
      .execute().map(_.status == 200)
  }
}

