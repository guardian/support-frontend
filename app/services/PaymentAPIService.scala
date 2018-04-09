package services

import java.io.IOException

import actions.CustomActionBuilders.OptionalAuthRequest
import cats.data.EitherT
import play.api.libs.json.{JsObject, JsValue, Json}
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

class PaymentAPIService(wsClient: WSClient, paymentAPIUrl: String, paymentApiPayPalExecutePaymentPath: String, identityService: IdentityService) {
  import PaymentAPIService._

  def convertQueryString(queryString: Map[String, Seq[String]]): List[(String, String)] = {
    queryString.foldLeft(List.empty[(String, String)]) {
      case (list, (key, values)) => list ::: values.map(x => (key, x)).toList
    }
  }

  private def getData(
    request: OptionalAuthRequest[AnyContent],
    acquisitionData: JsValue,
    paymentJSON: JsObject
  )(implicit req: RequestHeader, ec: ExecutionContext): Future[JsObject] = {

    import cats.syntax.applicativeError._
    import cats.instances.future._

    val defaultValue = Json.obj(
      "paymentData" -> paymentJSON,
      "acquisitionData" -> acquisitionData
    )

    request.user.fold {
      Future.successful(defaultValue)
    } { minimalUser =>
      {
        identityService.getUser(minimalUser).fold(
          _ => defaultValue,
          user => Json.obj(
            "paymentData" -> paymentJSON,
            "acquisitionData" -> acquisitionData,
            "signedInUserEmail" -> user.primaryEmailAddress
          )
        )
      }
    }
  }

  def execute(request: OptionalAuthRequest[AnyContent])(implicit req: RequestHeader, ec: ExecutionContext): Future[Boolean] = {
    import cats.syntax.applicativeError._
    import cats.instances.future._

    val cookieString = request.cookies.get("acquisition_data").get.value
    val acquisitionData = Json.parse(java.net.URLDecoder.decode(cookieString, "UTF-8"))
    val paymentJSON = Json.obj(
      "paymentId" -> request.getQueryString("paymentId").get,
      "payerId" -> request.getQueryString("PayerID").get
    )

    for {
      data <- getData(request, acquisitionData, paymentJSON)
      response <- wsClient.url(s"$paymentAPIUrl$paymentApiPayPalExecutePaymentPath")
        .withQueryStringParameters(convertQueryString(request.queryString): _*)
        .withHttpHeaders("Accept" -> "application/json")
        .withBody(data)
        .withMethod("POST")
        .execute()
    } yield response.status == 200
  }
}

