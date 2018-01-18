package services

import cats.data.EitherT
import com.gu.identity.play.{IdMinimalUser, IdUser}
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}
import play.api.mvc.RequestHeader

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._
import cats.implicits._
import java.net.URI

import com.google.common.net.InetAddresses
import config.Identity
import play.api.Logger
import play.api.libs.json.Json

import scala.util.Try
import scala.concurrent.{ExecutionContext, Future}

object IdentityServiceEnrichers {

  implicit class EnrichedList[A, B](underlying: List[(A, Option[B])]) {
    def flattenValues: List[(A, B)] = underlying.collect {
      case (k, Some(v)) => (k, v)
    }
  }

  implicit class EnrichedRequest(request: RequestHeader) {
    def clientIp: Option[String] = {
      request.headers.get("X-Forwarded-For").flatMap { xForwardedFor =>
        xForwardedFor.split(", ").find(publicIpAddress)
      }
    }

    private def publicIpAddress(address: String) =
      Try { InetAddresses.forString(address) }.exists(!_.isSiteLocalAddress)
  }

  implicit class EnrichedResponse(response: WSResponse) {
    def success: Boolean = response.status / 100 == 2
  }
}

object IdentityService {
  def apply(config: Identity)(implicit wsClient: WSClient): IdentityService = new IdentityService(
    apiUrl = config.apiUrl,
    apiClientToken = config.apiClientToken
  )
}
class IdentityService(apiUrl: String, apiClientToken: String)(implicit wsClient: WSClient) {

  import IdentityServiceEnrichers._

  private def request(path: String): WSRequest = {
    wsClient.url(s"$apiUrl/$path")
      .withHttpHeaders("Authorization" -> s"Bearer $apiClientToken")
  }

  def sendConsentPreferencesEmail(email: String)(implicit ec: ExecutionContext): Future[Boolean] = {
    val payload = Json.obj("email" -> email, "set-consents" -> Json.arr("supporter"))
    request(s"consent-email").post(payload).map { response =>
      val validResponse = response.status >= 200 && response.status < 300
      val logMessage = "Response from Identity Consent API: " + response.toString
      if (validResponse) Logger.info(logMessage)
      else Logger.error(logMessage)
      validResponse
    } recover {
      case e: Exception =>
        Logger.error("Impossible to update the user's marketing preferences", e)
        false
    }
  }

  private def headers(request: RequestHeader): List[(String, String)] = List(
    "X-GU-ID-Client-Access-Token" -> Some(s"Bearer $apiClientToken"),
    "X-GU-ID-FOWARDED-SC-GU-U" -> request.cookies.get("SC_GU_U").map(_.value),
    "Authorization" -> request.headers.get("GU-IdentityToken")
  ).flattenValues

  private def trackingParameters(request: RequestHeader): List[(String, String)] = List(
    "trackingReferer" -> request.headers.get("Referer"),
    "trackingUserAgent" -> request.headers.get("User-Agent"),
    "trackingIpAddress" -> request.clientIp
  ).flattenValues

  def getUser(user: IdMinimalUser)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, IdUser] = {
    get(s"user/${user.id}", headers(req), trackingParameters(req)) { resp =>
      (resp.json \ "user").validate[IdUser].asEither.leftMap(_.mkString(","))
    }
  }

  private def get[A](
    endpoint: String,
    headers: List[(String, String)],
    parameters: List[(String, String)]
  )(func: WSResponse => Either[String, A])(implicit ec: ExecutionContext) = {
    execute(
      wsClient.url(s"$apiUrl/$endpoint")
        .withHttpHeaders(headers: _*)
        .withQueryStringParameters(parameters: _*)
        .withRequestTimeout(1.second)
        .withMethod("GET")
    )(func)
  }

  private def uriWithoutQuery(uri: URI) = uri.toString.takeWhile(_ != '?')

  private def execute[A](requestHolder: WSRequest)(func: (WSResponse) => Either[String, A])(implicit ec: ExecutionContext) = {
    EitherT.right(requestHolder.execute()).subflatMap {
      case r if r.success =>
        func(r)
      case r =>
        Left(s"Identity API error: ${requestHolder.method} ${uriWithoutQuery(requestHolder.uri)} STATUS ${r.status}")
    }
  }
}