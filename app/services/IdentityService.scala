package services

import cats.data.EitherT
import com.gu.identity.play.{IdMinimalUser, IdUser}
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}
import play.api.mvc.RequestHeader
import scala.concurrent.{Future, ExecutionContext}
import scala.concurrent.duration._
import cats.implicits._
import java.net.URI

object IdentityServiceEnrichers {

  implicit class EnrichedList[A, B](underlying: List[(A, Option[B])]) {
    def flattenValues: List[(A, B)] = underlying.collect {
      case (k, Some(v)) => (k, v)
    }
  }

  implicit class EnrichedRequest(request: RequestHeader) {
    private val Ip = """(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})""".r

    def clientIp: Option[String] = {
      request.headers.get("X-Forwarded-For").flatMap { xForwardedFor =>
        xForwardedFor.split(", ").find {
          // leftmost non-private IP from header is client
          case Ip(a, b, c, d) => {
            if ("10" == a) false
            else if ("192" == a && "168" == b) false
            else if ("172" == a && (16 to 31).map(_.toString).contains(b)) false
            else true
          }
          case _ => false
        }
      }
    }
  }

  implicit class EnrichedResponse(response: WSResponse) {
    def success: Boolean = response.status / 100 == 2
  }
}

class IdentityService(idApiUrl: String, idApiClientToken: String)(implicit wsClient: WSClient) {

  import IdentityServiceEnrichers._

  private def headers(request: RequestHeader): List[(String, String)] = List(
    "X-GU-ID-Client-Access-Token" -> Some(s"Bearer $idApiClientToken"),
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
      wsClient.url(s"$idApiUrl/$endpoint")
        .withHeaders(headers: _*)
        .withQueryString(parameters: _*)
        .withRequestTimeout(1.second)
        .withMethod("GET")
    )(func)
  }

  private def uriAsString(uri: URI) = s"${uri.getScheme}${uri.getHost}/${uri.getPath}"

  private def execute[A](requestHolder: WSRequest)(func: (WSResponse) => Either[String, A])(implicit ec: ExecutionContext) = {
    EitherT.right(requestHolder.execute()).subflatMap {
      case r if r.success =>
        func(r)
      case r =>
        Left(s"Identity API error: ${requestHolder.method} ${uriAsString(requestHolder.uri)} STATUS ${r.status}")
    }
  }
}