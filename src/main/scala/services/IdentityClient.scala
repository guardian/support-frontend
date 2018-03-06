package services

import akka.util.ByteString
import cats.data.EitherT
import cats.instances.future._
import cats.syntax.applicativeError._
import cats.syntax.either._
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Error => CirceError}
import io.circe.generic.JsonCodec
import io.circe.parser.decode
import io.circe.syntax._
import play.api.libs.ws._

import scala.concurrent.Future

import conf.IdentityConfig
import model.DefaultThreadPool

class IdentityClient private (config: IdentityConfig)(implicit ws: WSClient, pool: DefaultThreadPool)
  extends StrictLogging {

  import IdentityClient._

  private def requestForPath(path: String): WSRequest =
    ws.url(s"${config.endpoint}$path").withHttpHeaders("x-gu-id-client-access-token" -> config.accessToken)

  private def decodeIdentityClientResponse[A : Decoder](response: WSResponse): Either[Error, A] =
    // Attempt to decode the response as an instance of A
    decode[A](response.body).leftMap { _ =>
      // If decoding A fails, it might be that the result was an API error instead.
      // So try to decode the result as an API error, finally creating an UnknownJsonFormat error if this fails too.
      decode[ApiError](response.body).fold(Error.fromCirceError, identity)
    }

  private def executeRequest[A : Decoder](request: WSRequest): Result[A] =
    request.execute().attemptT.leftMap(Error.fromThrowable).subflatMap(decodeIdentityClientResponse[A])

  def getUser(emailAddress: String): Result[UserResponse] =
    executeRequest[UserResponse] {
      requestForPath("/user")
        .withMethod("GET")
        .withQueryStringParameters("emailAddress" -> emailAddress)
    }

  def createGuestAccount(email: String): Result[GuestRegistrationResponse] =
    executeRequest[GuestRegistrationResponse] {
      requestForPath("/guest")
        .withMethod("POST")
        .withBody(CreateGuestAccountRequestBody(primaryEmailAddress = email))
    }
}

object IdentityClient extends StrictLogging {

  def fromIdentityConfig(config: IdentityConfig)(implicit ws: WSClient, pool: DefaultThreadPool): IdentityClient =
    new IdentityClient(config)

  @JsonCodec case class CreateGuestAccountRequestBody(primaryEmailAddress: String)

  object CreateGuestAccountRequestBody {

    implicit val bodyWriteable: BodyWritable[CreateGuestAccountRequestBody] = BodyWritable[CreateGuestAccountRequestBody](
      transform = body => InMemoryBody(ByteString.fromString(body.asJson.noSpaces)),
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
  @JsonCodec case class GuestRegistrationResponse(
    guestRegistrationRequest: GuestRegistrationResponse.GuestRegistrationRequest
  )

  object GuestRegistrationResponse {
    @JsonCodec case class GuestRegistrationRequest(userId: Long)
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
  @JsonCodec case class UserResponse(user: UserResponse.User)

  object UserResponse {
    @JsonCodec case class User(id: Long)
  }

  // Models an error created by a request to the identity client; either:
  // - an 'underlying' error occurred e.g. network error
  // - the client failed to correctly deserialize the JSON result
  // - the API reported an error in JSON format which was successfully deserialized.
  sealed trait Error extends Exception

  object Error {
    def fromThrowable(err: Throwable): Error = UnderlyingError(err)
    def fromCirceError(err: CirceError): Error = UnknownJsonFormat(err)
    def fromApiError(err: ApiError): Error = err
  }

  // Models a generic error returned by the API.
  //
  // Example response:
  // =================
  // {
  //   "status": "error",
  //   "errors": [
  //     {
  //       "message": "Not found",
  //       "description": "Resource not found"
  //     }
  //   ]
  // }
  @JsonCodec case class ApiError(errors: List[ApiError.Single]) extends Error {
    def isNotFound: Boolean = errors.exists(_.isNotFound)
    def isEmailInUse: Boolean = errors.exists(_.isEmailInUse)
  }

  object ApiError {
    @JsonCodec case class Single(message: String) {
      def isNotFound: Boolean = message == "Not found"
      def isEmailInUse: Boolean = message == "Email in use"
    }
  }

  case class UnderlyingError(err: Throwable) extends Error

  case class UnknownJsonFormat(err: CirceError) extends Error

  type Result[A] = EitherT[Future, IdentityClient.Error, A]
}