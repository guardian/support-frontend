package services

import cats.Monad
import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.ws.WSClient
import conf.IdentityConfig
import model.DefaultThreadPool
import services.IdentityClient.UserSignInDetailsResponse.UserSignInDetails
import services.IdentityClient.{ApiError, ContextualError, GuestRegistrationResponse, UserSignInDetailsResponse}

trait IdentityService extends StrictLogging {

  // Should return the identity id associated with the email, or None if there isn't one.
  def getIdentityIdFromEmail(email: String): IdentityClient.Result[Option[Long]]

  // Should return the sign in details associated with the email
  def getUserSignInDetailsFromEmail(email: String): IdentityClient.Result[UserSignInDetails]

  // Should return the identity id of the created account along with an optional guest account token.
  def createGuestAccount(email: String): IdentityClient.Result[IdentityIdWithGuestAccountCreationToken]

  // TODO: better method name
  // Look up the identity id for the given email address.
  // If one exists then return it, otherwise create a guest account and return the associated identity id.
  def getOrCreateIdentityIdFromEmail(email: String): IdentityClient.Result[IdentityIdWithGuestAccountCreationToken]

}

case class IdentityIdWithGuestAccountCreationToken(identityId: Long, guestAccountCreationToken: Option[String])

object IdentityIdWithGuestAccountCreationToken {
  def fromGuestRegistrationResponse(guestRegistrationResponse: GuestRegistrationResponse): IdentityIdWithGuestAccountCreationToken =
    IdentityIdWithGuestAccountCreationToken(
      guestRegistrationResponse.guestRegistrationRequest.userId,
      guestRegistrationResponse.guestRegistrationRequest.token
    )
}

// Default implementation of the IdentityService trait using the client to the Guardian identity API.
class GuardianIdentityService (client: IdentityClient)(implicit pool: DefaultThreadPool) extends IdentityService {

  override def getIdentityIdFromEmail(email: String): IdentityClient.Result[Option[Long]] =
    client.getUser(email).map(response => Option(response.user.id)).recover {
      // If the API error was that the result was not found,
      // then we can confidently say there is no identity id for the given email address.
      case ContextualError(error: ApiError, _) if error.isNotFound => Option.empty[Long]
    }

  override def getUserSignInDetailsFromEmail(email: String): IdentityClient.Result[UserSignInDetails] =
    client.getUserDetails(email).map(response => response.userSignInDetails)

  override def createGuestAccount(email: String): IdentityClient.Result[IdentityIdWithGuestAccountCreationToken] =
    client.createGuestAccount(email).map { response =>
      // Logs are only retained for 14 days so we're OK to log email address
      logger.info(s"guest account created for email address: $email")
      IdentityIdWithGuestAccountCreationToken.fromGuestRegistrationResponse(response)
    }

  override def getOrCreateIdentityIdFromEmail(email: String): IdentityClient.Result[IdentityIdWithGuestAccountCreationToken] =
    for {
      preExistingIdentityId <- getIdentityIdFromEmail(email)
      userIdWithGuestAccountCreationToken <- preExistingIdentityId match {
        case None =>
          createGuestAccount(email)
        case Some(id) =>
          // pure lifts the identity id into the monadic context.
          Monad[IdentityClient.Result].pure(IdentityIdWithGuestAccountCreationToken(id, None))
      }
    } yield userIdWithGuestAccountCreationToken
}

object IdentityService {

  def fromIdentityConfig(config: IdentityConfig)(implicit ws: WSClient, pool: DefaultThreadPool): IdentityService = {
    val guardianIdentityClient = IdentityClient.fromIdentityConfig(config)
    new GuardianIdentityService(guardianIdentityClient)
  }
}
