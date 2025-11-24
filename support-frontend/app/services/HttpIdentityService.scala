package services

import cats.data.EitherT
import cats.implicits._
import com.google.common.net.InetAddresses
import com.gu.identity.model.PrivateFields
import com.gu.monitoring.SafeLogging
import com.gu.retry.EitherTRetry.retry
import config.Identity
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import models.identity.requests.CreateGuestAccountRequestBody
import models.identity.responses.IdentityErrorResponse.{GuestEndpoint, IdentityError, OtherIdentityError, UserEndpoint}
import models.identity.responses.{GuestRegistrationResponse, IdentityErrorResponse, UserResponse}
import org.apache.pekko.actor.Scheduler
import play.api.libs.json.{JsPath, Json, JsonValidationError, Reads}
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}
import play.api.mvc.RequestHeader

import java.net.URI
import scala.collection.Seq
import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

object IdentityServiceEnrichers {

  implicit class EnrichedList[A, B](underlying: List[(A, Option[B])]) {
    def flattenValues: List[(A, B)] = underlying.collect { case (k, Some(v)) =>
      (k, v)
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

case class GetUserTypeResponse(userType: String)
object GetUserTypeResponse {
  implicit val readsGetUserTypeResponse: Reads[GetUserTypeResponse] = Json.reads[GetUserTypeResponse]
  implicit val getUserTypeEncoder: Encoder[GetUserTypeResponse] = deriveEncoder
}

case class UserDetails(
    identityId: String,
    email: String,
    userType: String,
)

sealed trait GetUserTypeError {
  def describeError: String
}

object GetUserTypeError {
  case class CallFailed(error: Throwable) extends GetUserTypeError {
    override def describeError: String = s"Call failed with error: ${error.getMessage}"
  }
  case class GotErrorResponse(response: WSResponse) extends GetUserTypeError {
    override def describeError: String = s"Got error response: ${response.status} ${response.body}"
  }
  case class DecodeFailed(decodeErrors: Seq[(JsPath, Seq[JsonValidationError])]) extends GetUserTypeError {
    override def describeError: String = s"Failed to decode response: ${decodeErrors.mkString(",")}"
  }
}

case class CreateSignInTokenResponse(encryptedEmail: String)
object CreateSignInTokenResponse {
  implicit val readCreateSignInTokenResponse: Reads[CreateSignInTokenResponse] = Json.reads[CreateSignInTokenResponse]
}

object IdentityService {
  def apply(config: Identity)(implicit wsClient: WSClient): IdentityService =
    new IdentityService(apiUrl = config.apiUrl, apiClientToken = config.apiClientToken)
}

class IdentityService(apiUrl: String, apiClientToken: String)(implicit wsClient: WSClient) extends SafeLogging {

  import IdentityServiceEnrichers._

  private def request(path: String): WSRequest = {
    wsClient
      .url(s"$apiUrl/$path")
      .withHttpHeaders("Authorization" -> s"Bearer $apiClientToken")
  }

  def sendConsentPreferencesEmail(email: String)(implicit ec: ExecutionContext): Future[Boolean] = {
    val payload = Json.obj("email" -> email, "set-consents" -> Json.arr("supporter"))
    request(s"consent-email").post(payload).map { response =>
      val validResponse = response.status >= 200 && response.status < 300
      if (validResponse) logger.info("Successful response from Identity Consent API")
      else logger.error(scrub"Failure response from Identity Consent API: ${response.toString}")
      validResponse
    } recover { case e: Exception =>
      logger.error(scrub"Failed to update the user's marketing preferences $e")
      false
    }
  }

  def getUserType(
      email: String,
  )(implicit ec: ExecutionContext): EitherT[Future, GetUserTypeError, GetUserTypeResponse] = {
    request(s"user/type/$email")
      .get()
      .attemptT
      .leftMap(GetUserTypeError.CallFailed)
      .subflatMap(resp =>
        if (resp.status >= 300) {
          Left(GetUserTypeError.GotErrorResponse(resp))
        } else {
          resp.json.validate[GetUserTypeResponse].asEither.leftMap(GetUserTypeError.DecodeFailed)
        },
      )
  }

  def createSignInToken(
      email: String,
  )(implicit ec: ExecutionContext): EitherT[Future, String, CreateSignInTokenResponse] = {
    val payload = Json.obj("email" -> email)
    request(s"signin-token/email")
      .post(payload)
      .attemptT
      .leftMap(_.toString)
      .subflatMap(resp => resp.json.validate[CreateSignInTokenResponse].asEither.leftMap(_.mkString(",")))
  }

  def getOrCreateUserFromEmail(
      email: String,
      firstName: String,
      lastName: String,
      pageViewId: Option[String],
      referer: Option[String],
      accountVerificationEmail: Boolean,
  )(implicit ec: ExecutionContext, scheduler: Scheduler): EitherT[Future, IdentityError, UserDetails] = {
    // Try to fetch the user's information with their email address and if it does not exist
    // or there is an error try again up to a total of 3 times with a 500 millisecond delay between
    // each attempt.
    // We try to fetch the user information at the start of each attempt in case a previous `createUser`
    // call succeeded but timed out before returning a valid response
    retry(
      getUserDetailsFromEmail(email).leftFlatMap(_ =>
        createUserIdFromEmailUser(email, firstName, lastName, pageViewId, referer, accountVerificationEmail),
      ),
      delay = 500.milliseconds,
      retries = 2,
    )
  }

  def getUserDetailsFromEmail(
      email: String,
  )(implicit ec: ExecutionContext, scheduler: Scheduler): EitherT[Future, IdentityError, UserDetails] =
    execute(
      wsClient
        .url(s"$apiUrl/user")
        .withHttpHeaders(List("X-GU-ID-Client-Access-Token" -> s"Bearer $apiClientToken"): _*)
        .withQueryStringParameters(List("emailAddress" -> email): _*)
        .withRequestTimeout(7.seconds)
        .withMethod("GET"),
    ) { resp =>
      resp.json
        .validate[UserResponse]
        .asEither
        .leftMap(err =>
          OtherIdentityError(
            message = "Error deserialising json to UserResponse",
            description = err.mkString(","),
            endpoint = Some(UserEndpoint),
          ),
        )
        .map(userResponse => UserDetails(userResponse.user.id, email, "current"))
    }.leftMap(e => e.setEndpoint(UserEndpoint))

  def createUserIdFromEmailUser(
      email: String,
      firstName: String,
      lastName: String,
      pageViewId: Option[String],
      referer: Option[String],
      accountVerificationEmail: Boolean,
  )(implicit ec: ExecutionContext, scheduler: Scheduler): EitherT[Future, IdentityError, UserDetails] = {
    val body = CreateGuestAccountRequestBody(
      email,
      PrivateFields(
        firstName = Some(firstName).filter(_.nonEmpty),
        secondName = Some(lastName).filter(_.nonEmpty),
      ),
    )
    execute(
      wsClient
        .url(s"$apiUrl/guest")
        .withHttpHeaders(
          List(
            "X-GU-ID-Client-Access-Token" -> Some(s"Bearer $apiClientToken"),
            "Content-Type" -> Some("application/json"),
          ).flattenValues: _*,
        )
        .withBody(body)
        .withRequestTimeout(7.seconds)
        .withMethod("POST")
        .withQueryStringParameters(
          List(
            Some(("accountVerificationEmail", s"$accountVerificationEmail")),
            pageViewId.map(viewId => ("refViewId", viewId)),
            referer.map(refUrl => ("ref", refUrl)),
          ).flatten: _*,
        ),
    ) { resp =>
      resp.json
        .validate[GuestRegistrationResponse]
        .asEither
        .leftMap(err =>
          OtherIdentityError(
            message = "Error deserialising json to GuestRegistrationResponse",
            description = err.mkString(","),
            endpoint = Some(GuestEndpoint),
          ),
        )
        .map(response => UserDetails(response.guestRegistrationRequest.userId, email, "new"))
    }
  }.leftMap(e => e.setEndpoint(GuestEndpoint))

  private def uriWithoutQuery(uri: URI) = uri.toString.takeWhile(_ != '?')

  private def execute[A](
      requestHolder: WSRequest,
  )(func: WSResponse => Either[IdentityError, A])(implicit ec: ExecutionContext, scheduler: Scheduler) = {

    EitherT(requestHolder.execute().map(response => Right(response)).recover { case t =>
      Left(OtherIdentityError("An exception was thrown in HttpIdentityService.execute", t.getMessage, endpoint = None))
    }).subflatMap {
      case r if r.success => func(r)
      case r =>
        r.json
          .validate[IdentityErrorResponse]
          .asEither
          .leftMap(_ =>
            OtherIdentityError(
              message = s"${r.body}",
              description =
                s"Identity API error: ${requestHolder.method} ${uriWithoutQuery(requestHolder.uri)} STATUS ${r.status}, BODY: ${r.body}",
              endpoint = None,
            ),
          )
          .flatMap(error => Left(error.errors.head))
    }
  }
}
