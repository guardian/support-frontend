package services

import cats.data.EitherT
import com.gu.identity.play.{IdMinimalUser, IdUser, PrivateFields, PublicFields}
import play.api.libs.ws.{BodyWritable, InMemoryBody, WSClient, WSRequest, WSResponse}
import play.api.mvc.RequestHeader

import scala.concurrent.duration._
import cats.implicits._
import java.net.URI

import akka.util.ByteString
import com.google.common.net.InetAddresses
import config.Identity
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.json.{Json, Reads, Writes}
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
  def apply(config: Identity)(implicit wsClient: WSClient): IdentityService = {
    if (config.useStub) new StubIdentityService else {
      new HttpIdentityService(
        apiUrl = config.apiUrl,
        apiClientToken = config.apiClientToken
      )
    }
  }
}

// Models a valid request to /guest
//
// Example request:
// =================
// {
//   "email": "a@b.com",
//   "publicFields": {
//     "displayName": "a"
//   }
// }
case class CreateGuestAccountRequestBody(primaryEmailAddress: String, publicFields: PublicFields)
object CreateGuestAccountRequestBody {

  def guestDisplayName(email: String): String = email.split("@").headOption.getOrElse("Guest User")

  def fromEmail(email: String): CreateGuestAccountRequestBody = CreateGuestAccountRequestBody(email, PublicFields(Some(guestDisplayName(email))))

  implicit val writesCreateGuestAccountRequestBody: Writes[CreateGuestAccountRequestBody] = Json.writes[CreateGuestAccountRequestBody]
  implicit val bodyWriteable: BodyWritable[CreateGuestAccountRequestBody] = BodyWritable[CreateGuestAccountRequestBody](
    transform = body => InMemoryBody(ByteString.fromString(Json.toJson(body).toString)),
    contentType = "application/json"
  )

}

// Models the response of successfully creating a guest account.
//
// Example response:
// =================
// {
//   "status": "ok",
//   "guestRegistrationRequest": {
//     "token": "83e41c1d-458d-49c0-b469-ddc263507034",
//     "userId": "100000190",
//     "timeIssued": "2018-02-28T14:46:01Z"
//   }
// }
case class GuestRegistrationResponse(
    guestRegistrationRequest: GuestRegistrationResponse.GuestRegistrationRequest
)

// A userId with an optional guest account registration toke (created when a guest account is registered)
case class UserIdWithGuestAccountToken(userId: String, guestAccountRegistrationToken: Option[String])

object UserIdWithGuestAccountToken {
  def fromGuestRegistrationResponse(guestRegistrationResponse: GuestRegistrationResponse): UserIdWithGuestAccountToken =
    UserIdWithGuestAccountToken(
      guestRegistrationResponse.guestRegistrationRequest.userId,
      guestRegistrationResponse.guestRegistrationRequest.token
    )
}

object GuestRegistrationResponse {
  implicit val readsGuestRegistrationResponse: Reads[GuestRegistrationResponse] = Json.reads[GuestRegistrationResponse]
  case class GuestRegistrationRequest(token: Option[String], userId: String)

  object GuestRegistrationRequest {
    implicit val readsGuestRegistrationRequest: Reads[GuestRegistrationRequest] = Json.reads[GuestRegistrationRequest]
  }
}

// Models the response of successfully looking up user details via email address.
//
// Example response:
// =================
// {
//   "status": "ok",
//   "user": {
//     "id": "100000190",
//     "dates": {
//       "accountCreatedDate": "2018-02-28T14:46:01Z"
//     }
//   }
// }
case class UserResponse(user: UserResponse.User)

object UserResponse {

  implicit val readsUserResponse: Reads[UserResponse] = Json.reads[UserResponse]
  case class User(id: String)

  object User {
    implicit val readsUser: Reads[User] = Json.reads[User]
  }
}

class HttpIdentityService(apiUrl: String, apiClientToken: String)(implicit wsClient: WSClient) extends IdentityService {

  import IdentityServiceEnrichers._

  private def request(path: String): WSRequest = {
    wsClient.url(s"$apiUrl/$path")
      .withHttpHeaders("Authorization" -> s"Bearer $apiClientToken")
  }

  def sendConsentPreferencesEmail(email: String)(implicit ec: ExecutionContext): Future[Boolean] = {
    val payload = Json.obj("email" -> email, "set-consents" -> Json.arr("supporter"))
    request(s"consent-email").post(payload).map { response =>
      val validResponse = response.status >= 200 && response.status < 300
      if (validResponse) SafeLogger.info("Successful response from Identity Consent API")
      else SafeLogger.error(scrub"Failure response from Identity Consent API: ${response.toString}")
      validResponse
    } recover {
      case e: Exception =>
        SafeLogger.error(scrub"Failed to update the user's marketing preferences $e")
        false
    }
  }

  private def getHeaders(request: RequestHeader): List[(String, String)] = List(
    "X-GU-ID-Client-Access-Token" -> Some(s"Bearer $apiClientToken"),
    "X-GU-ID-FOWARDED-SC-GU-U" -> request.cookies.get("SC_GU_U").map(_.value),
    "Authorization" -> request.headers.get("GU-IdentityToken")
  ).flattenValues

  private def postHeaders(request: RequestHeader): List[(String, String)] = List(
    "X-GU-ID-Client-Access-Token" -> Some(s"Bearer $apiClientToken"),
    "Content-Type" -> Some("application/json")
  ).flattenValues

  private def trackingParameters(request: RequestHeader): List[(String, String)] = List(
    "trackingReferer" -> request.headers.get("Referer"),
    "trackingUserAgent" -> request.headers.get("User-Agent"),
    "trackingIpAddress" -> request.clientIp
  ).flattenValues

  def getUser(user: IdMinimalUser)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, IdUser] = {
    get(s"user/${user.id}", getHeaders(req), trackingParameters(req)) { resp =>
      (resp.json \ "user").validate[IdUser].asEither.leftMap(_.mkString(","))
    }
  }

  def getUserIdFromEmail(email: String)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, UserIdWithGuestAccountToken] = {
    get(s"user", getHeaders(req), List("emailAddress" -> email)) { resp =>
      resp.json.validate[UserResponse].asEither.map(
        userResponse => UserIdWithGuestAccountToken(userResponse.user.id, None)
      ).leftMap(_.mkString(","))
    }
  }

  def createUserIdFromEmailUser(email: String)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, UserIdWithGuestAccountToken] = {
    val body = CreateGuestAccountRequestBody.fromEmail(email)
    execute(
      wsClient.url(s"$apiUrl/guest")
        .withHttpHeaders(postHeaders(req): _*)
        .withBody(body)
        .withRequestTimeout(1.second)
        .withMethod("POST")
    ) { resp =>
        resp.json.validate[GuestRegistrationResponse]
          .asEither
          .bimap( _.mkString(","), response => UserIdWithGuestAccountToken.fromGuestRegistrationResponse(response))
      }
  }

  def getOrCreateUserIdFromEmail(email: String)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, UserIdWithGuestAccountToken] = {
    getUserIdFromEmail(email).leftFlatMap(_ => createUserIdFromEmailUser(email))
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

trait IdentityService {
  def getUser(user: IdMinimalUser)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, IdUser]
  def sendConsentPreferencesEmail(email: String)(implicit ec: ExecutionContext): Future[Boolean]
  def getOrCreateUserIdFromEmail(email: String)(implicit req: RequestHeader, ec: ExecutionContext): EitherT[Future, String, UserIdWithGuestAccountToken]
}