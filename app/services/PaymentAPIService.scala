package services

import play.api.libs.json.{JsObject, JsValue, Json}
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

class PaymentAPIService(wsClient: WSClient, paymentAPIUrl: String, paymentApiPayPalExecutePaymentPath: String) {

  def convertQueryString(queryString: Map[String, Seq[String]]): List[(String, String)] = {
    queryString.foldLeft(List.empty[(String, String)]) {
      case (list, (key, values)) => list ::: values.map(x => (key, x)).toList
    }
  }

  private def postData(data: JsObject, queryStrings: Map[String, Seq[String]], isTestUser: Boolean) = {

    val testQueryParam = if (isTestUser) "?mode=test" else ""
    val endpoint = s"$paymentAPIUrl$paymentApiPayPalExecutePaymentPath$testQueryParam"

    wsClient.url(endpoint)
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
    email: Option[String],
    isTestUser: Boolean
  )(implicit ec: ExecutionContext): Future[Boolean] = {
    val data = getData(email, acquisitionData, paymentJSON)
    postData(data, queryStrings, isTestUser).map(_.status == 200)
  }
}

