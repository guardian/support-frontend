package services

import java.io.IOException

import play.api.libs.json.{JsObject, JsValue, Json}
import play.api.libs.ws.{WSClient, WSResponse}

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

  def convertQueryString(queryString: Map[String, Seq[String]]): List[(String, String)] = {
    queryString.foldLeft(List.empty[(String, String)]) {
      case (list, (key, values)) => list ::: values.map(x => (key, x)).toList
    }
  }

  private def postData(data: JsObject, queryStrings: Map[String, Seq[String]]) = {

    wsClient.url(s"$paymentAPIUrl$paymentApiPayPalExecutePaymentPath")
      .withQueryStringParameters(convertQueryString(queryStrings): _*)
      .withHttpHeaders("Accept" -> "application/json")
      .withBody(data)
      .withMethod("POST")
      .execute()
  }

  private def getData(
    emailOpt: Option[String],
    acquisitionData: JsValue,
    paymentJSON: JsObject
  ): JsObject = {

    val defaultValue = Json.obj(
      "paymentData" -> paymentJSON,
      "acquisitionData" -> acquisitionData
    )

    emailOpt.fold {
      defaultValue
    } {
      email =>
        Json.obj(
          "paymentData" -> paymentJSON,
          "acquisitionData" -> acquisitionData,
          "signedInUserEmail" -> email
        )
    }
  }

  def execute(
    paymentJSON: JsObject,
    acquisitionData: JsValue,
    queryStrings: Map[String, Seq[String]],
    email: Option[String]
  )(implicit ec: ExecutionContext): Future[Boolean] = {
    val data = getData(email, acquisitionData, paymentJSON)
    postData(data, queryStrings).map(_.status == 200)
  }
}

