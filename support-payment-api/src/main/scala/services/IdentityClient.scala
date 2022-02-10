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
    ws
      .url(s"${config.endpoint}$path")
      .withHttpHeaders("x-gu-id-client-access-token" -> s"Bearer ${config.accessToken}")

  private def decodeIdentityClientResponse[A: Decoder](response: WSResponse): Either[Error, A] =
    // Attempt to decode the response as an instance of A
    decode[A](response.body).leftMap { _ =>
      // If decoding A fails, it might be that the result was an API error instead.
      // So try to decode the result as an API error, finally creating an UnknownJsonFormat error if this fails too.
      decode[ApiError](response.body).fold(Error.fromCirceError(response.body, _), identity)
    }

  private def executeRequest[A: Decoder](request: WSRequest): EitherT[Future, Error, A] = {
    logger.info(s"Identity request: $request")
    request
      .execute()
      .attemptT
      .bimap(
        Error.fromThrowable,
        resp => {
          logger.info(s"Identity response: $resp")
          resp
        },
      )
      .subflatMap(decodeIdentityClientResponse[A])
  }

  def getUser(email: String): Result[UserResponse] =
    executeRequest[UserResponse] {
      requestForPath("/user")
        .withMethod("GET")
        .withQueryStringParameters("emailAddress" -> email)
    }
      // Would be DRYER to have a generic execute action method, which given an action, builds the request, executes it,
      // and then left maps the error into a contextual error (able to do this last step as the action is known).
      // However, this would require additional re-factorisation which is getting deferred to another PR.
      .leftMap(error => ContextualError(error, GetUser(email)))

  def createGuestAccount(email: String): Result[GuestRegistrationResponse] =
    executeRequest[GuestRegistrationResponse] {
      requestForPath("/guest")
        .withMethod("POST")
        .withBody(CreateGuestAccountRequestBody.fromEmail(email))
        .withQueryStringParameters(("accountVerificationEmail", "true"))
    }
      // See comment on getUser() method.
      .leftMap(error => ContextualError(error, CreateGuestAccount(email)))
}

object IdentityClient extends StrictLogging {
  def fromIdentityConfig(config: IdentityConfig)(implicit ws: WSClient, pool: DefaultThreadPool): IdentityClient =
    new IdentityClient(config)

  @JsonCodec case class PublicFields(displayName: String)

  @JsonCodec case class CreateGuestAccountRequestBody(primaryEmailAddress: String, publicFields: PublicFields)

  object CreateGuestAccountRequestBody {

    def guestDisplayName(email: String): String = email.split("@").headOption.getOrElse("Guest User")

    def fromEmail(email: String): CreateGuestAccountRequestBody =
      CreateGuestAccountRequestBody(email, PublicFields(guestDisplayName(email)))

    implicit val bodyWriteable: BodyWritable[CreateGuestAccountRequestBody] =
      BodyWritable[CreateGuestAccountRequestBody](
        transform = body => InMemoryBody(ByteString.fromString(body.asJson.noSpaces)),
        contentType = "application/json",
      )
  }

  // Models the response of successfully creating a guest account.
  //
  // Example response:
  // =================
  // {
  //   "status": "ok",
  //   "guestRegistrationRequest": {
  //     "userId": "100000190",
  //     "timeIssued": "2018-02-28T14:46:01Z"
  //   }
  // }
  @JsonCodec case class GuestRegistrationResponse(
      guestRegistrationRequest: GuestRegistrationResponse.GuestRegistrationRequest,
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
  sealed trait Error extends Exception {
    override def getMessage: String = this match {
      case ApiError(errors) => errors.map(_.message).mkString(" and ")
      case UnderlyingError(err) => err.getMessage
      case UnknownJsonFormat(json, err) => s"unable to decode json: $json - ${err.getMessage}"
    }
  }

  object Error {
    def fromThrowable(err: Throwable): Error = UnderlyingError(err)
    def fromCirceError(json: String, err: CirceError): Error = UnknownJsonFormat(json, err)
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

  case class UnknownJsonFormat(json: String, err: CirceError) extends Error

  sealed trait Action
  case class GetUser(email: String) extends Action
  case class CreateGuestAccount(email: String) extends Action

  // Allows for the creation of a useful monad M[A] = EitherT[Future, ContextualError, A]
  // which is able to provide information on when the flow has failed.
  case class ContextualError(error: Error, action: Action) extends Exception {
    override def getMessage: String = s"error executing identity client action $action - ${error.getMessage}"
  }

  type Result[A] = EitherT[Future, IdentityClient.ContextualError, A]
}
