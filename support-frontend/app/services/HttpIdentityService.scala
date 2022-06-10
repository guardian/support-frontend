package services

import akka.actor.Scheduler
import cats.data.EitherT
import cats.syntax.all._
import com.google.common.net.InetAddresses
import com.gu.identity.model.PrivateFields
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import config.Identity
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import models.identity.requests.CreateGuestAccountRequestBody
import models.identity.responses.IdentityErrorResponse.IdentityError
import models.identity.responses.{GuestRegistrationResponse, IdentityErrorResponse, UserResponse}
import play.api.libs.json.{Json, Reads}
import play.api.libs.ws.{WSClient, WSRequest, WSResponse}
import play.api.mvc.RequestHeader
import utils.EitherTRetry

import java.net.URI
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

case class CreateSignInTokenResponse(encryptedEmail: String)
object CreateSignInTokenResponse {
  implicit val readCreateSignInTokenResponse: Reads[CreateSignInTokenResponse] = Json.reads[CreateSignInTokenResponse]
}

object IdentityService {
  def apply(config: Identity)(implicit wsClient: WSClient): IdentityService =
    new IdentityService(apiUrl = config.apiUrl, apiClientToken = config.apiClientToken)
}

class IdentityService(apiUrl: String, apiClientToken: String)(implicit wsClient: WSClient) {

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
      if (validResponse) SafeLogger.info("Successful response from Identity Consent API")
      else SafeLogger.error(scrub"Failure response from Identity Consent API: ${response.toString}")
      validResponse
    } recover { case e: Exception =>
      SafeLogger.error(scrub"Failed to update the user's marketing preferences $e")
      false
    }
  }

  def getUserType(
      email: String,
  )(implicit ec: ExecutionContext): EitherT[Future, String, GetUserTypeResponse] = {
    request(s"user/type/$email")
      .get()
      .attemptT
      .leftMap(_.toString)
      .subflatMap(resp => resp.json.validate[GetUserTypeResponse].asEither.leftMap(_.mkString(",")))
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
  )(implicit ec: ExecutionContext, scheduler: Scheduler): EitherT[Future, IdentityError, String] = {
    // Try to fetch the user's information with their email address and if it does not exist
    // or there is an error try again up to a total of 3 times with a 500 millisecond delay between
    // each attempt.
    // We try to fetch the user information at the start of each attempt in case a previous `createUser`
    // call succeeded but timed out before returning a valid response
    EitherTRetry.retry(
      getUserIdFromEmail(email).leftFlatMap(_ =>
        createUserIdFromEmailUser(email, firstName, lastName, pageViewId, referer),
      ),
      delay = 500.milliseconds,
      retries = 2,
    )
  }

  def getUserIdFromEmail(
      email: String,
  )(implicit ec: ExecutionContext, scheduler: Scheduler): EitherT[Future, IdentityError, String] =
    execute(
      wsClient
        .url(s"$apiUrl/user")
        .withHttpHeaders(List("X-GU-ID-Client-Access-Token" -> s"Bearer $apiClientToken"): _*)
        .withQueryStringParameters(List("emailAddress" -> email): _*)
        .withRequestTimeout(3.seconds)
        .withMethod("GET"),
    ) { resp =>
      resp.json
        .validate[UserResponse]
        .asEither
        .leftMap(err =>
          IdentityError(
            message = "Error deserialising json to UserResponse",
            description = err.mkString(","),
          ),
        )
        .map(userResponse => userResponse.user.id)
    }

  def createUserIdFromEmailUser(
      email: String,
      firstName: String,
      lastName: String,
      pageViewId: Option[String],
      referer: Option[String],
  )(implicit ec: ExecutionContext, scheduler: Scheduler): EitherT[Future, IdentityError, String] = {
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
        .withRequestTimeout(3.seconds)
        .withMethod("POST")
        .withQueryStringParameters(
          List(
            Some(("accountVerificationEmail", "true")),
            pageViewId.map(viewId => ("refViewId", viewId)),
            referer.map(refUrl => ("ref", refUrl)),
          ).flatten: _*,
        ),
    ) { resp =>
      resp.json
        .validate[GuestRegistrationResponse]
        .asEither
        .leftMap(err =>
          IdentityError(
            message = "Error deserialising json to GuestRegistrationResponse",
            description = err.mkString(","),
          ),
        )
        .map(response => response.guestRegistrationRequest.userId)
    }
  }

  private def uriWithoutQuery(uri: URI) = uri.toString.takeWhile(_ != '?')

  private def execute[A](
      requestHolder: WSRequest,
  )(func: (WSResponse) => Either[IdentityError, A])(implicit ec: ExecutionContext, scheduler: Scheduler) = {

    EitherT(requestHolder.execute().map(response => Right(response)).recover { case t =>
      Left(IdentityError("An exception was thrown in HttpIdentityService.execute", t.getMessage))
    }).subflatMap {
      case r if r.success => func(r)
      case r =>
        r.json
          .validate[IdentityErrorResponse]
          .asEither
          .leftMap(_ =>
            IdentityError(
              message = s"${r.body}",
              description =
                s"Identity API error: ${requestHolder.method} ${uriWithoutQuery(requestHolder.uri)} STATUS ${r.status}, BODY: ${r.body}",
            ),
          )
          .flatMap(error => Left(error.errors.head))
    }
  }
}
