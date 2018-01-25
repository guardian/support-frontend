package services

import cats.data.EitherT
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}
import play.api.mvc.RequestHeader
import play.api.libs.json.{JsSuccess, Json, Reads, Writes}

import scala.concurrent.duration._
import cats.implicits._
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource}
import play.api.Logger

import scala.concurrent.{ExecutionContext, Future}

object ContributionsFrontendService {
  def apply()(implicit wsClient: WSClient): ContributionsFrontendService = new ContributionsFrontendService(wsClient)
}
class ContributionsFrontendService(wsClient: WSClient) {
  import IdentityServiceEnrichers._

  val apiUrl = "https://contribute.thegulocal.com/"

  private def headers(request: RequestHeader): List[(String, String)] = List("Content-Type" -> "application/json")

  private def get[A](
    endpoint: String,
    headers: List[(String, String)],
    parameters: List[(String, String)]
  )(func: WSResponse => Either[String, A])(implicit ec: ExecutionContext) = {
    executeRequest(
      wsClient.url(s"$apiUrl/$endpoint")
        .withHttpHeaders(headers: _*)
        .withQueryStringParameters(parameters: _*)
        .withMethod("GET")
    )(func)
  }

  def getEmailFromRequest(resp: WSResponse): Option[String] = {
    (resp.json \ "email").validate[String] match {
      case x: JsSuccess[String] => Some(x.get)
      case _ => None
    }
  }

  // scalastyle:off parameter.number
  def execute(
    paymentId: String,
    token: String,
    PayerID: String,
    cmp: Option[String],
    intCmp: Option[String],
    refererPageviewId: Option[String],
    refererUrl: Option[String],
    pvid: Option[String],
    bid: Option[String],
    ophanVisitId: Option[String],
    componentId: Option[String],
    componentType: Option[ComponentType],
    source: Option[AcquisitionSource],
    refererAbTest: Option[AbTest],
    nativeAbTests: Option[Set[AbTest]],
    supportRedirect: Option[Boolean]
  )(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, Option[String]] = {
    import utils.QueryStringBindableUtils.Syntax._
    import utils.ThriftUtils.Implicits._
    val endpoint = s"/paypal/uk/execute"
    val parameters = List(
      Some("paymentId" -> paymentId), Some("token" -> token), Some("PayerID" -> PayerID),
      cmp.map("CMP" -> _),
      intCmp.map("INTCMP" -> _),
      pvid.map("pvid" -> _),
      bid.map("bid" -> _),
      refererPageviewId.map("refererPageviewId" -> _),
      refererUrl.map("refererUrl" -> _),
      ophanVisitId.map("ophanVisitId" -> _),
      componentId.map("componentId" -> _),
      componentType.map("componentType" -> _.valueAsString("componentType")),
      source.map("source" -> _.valueAsString("source")),
      refererAbTest.map("refererAbTest" -> Json.toJson(_).toString),
      nativeAbTests.map("nativeAbTests" -> Json.toJson(_).toString),
      supportRedirect.map(value => "supportRedirect" -> value.toString)
    ).flatten
    get(endpoint, headers(req), parameters) { resp =>
      Logger.info(resp.toString)
      if (resp.status >= 200 && resp.status < 300) {
        Right(getEmailFromRequest(resp))
      } else {
        Left(s"Error: ${resp.toString}")
      }
    }
  }

  private def executeRequest[A](requestHolder: WSRequest)(func: (WSResponse) => Either[String, A])(implicit ec: ExecutionContext) = {
    EitherT.right(requestHolder.execute()).subflatMap {
      case r if r.success =>
        func(r)
      case r =>
        Left(s"contribute.theguardian.com paypal endpoint error: ${requestHolder.method}")
    }
  }
}