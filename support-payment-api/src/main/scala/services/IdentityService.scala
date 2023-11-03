package services

import cats.Monad
import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import conf.IdentityConfig
import model.DefaultThreadPool
import play.api.libs.ws.WSClient
import services.IdentityClient.{ApiError, ContextualError}

trait IdentityService extends StrictLogging {

  // Should return the identity id associated with the email, or None if there isn't one.
  def getIdentityIdFromEmail(email: String): IdentityClient.Result[Option[String]]

  // Should return the identity id of the created account along with an optional guest account token.
  def createGuestAccount(email: String): IdentityClient.Result[String]

  // Look up the identity id for the given email address.
  // If one exists then return it, otherwise create a guest account and return the associated identity id.
  def getOrCreateIdentityIdFromEmail(email: String): IdentityClient.Result[String]

}

// Default implementation of the IdentityService trait using the client to the Guardian identity API.
class GuardianIdentityService(client: IdentityClient)(implicit pool: DefaultThreadPool) extends IdentityService {

  override def getIdentityIdFromEmail(email: String): IdentityClient.Result[Option[String]] = {
    client.getUser(email).map(response => Option(response.user.id)).recover {
      // If the API error was that the result was not found,
      // then we can confidently say there is no identity id for the given email address.
      case ContextualError(error: ApiError, _) if error.isNotFound => Option.empty[String]
    }
  }

  override def createGuestAccount(email: String): IdentityClient.Result[String] =
    client.createGuestAccount(email).map { response =>
      // Logs are only retained for 14 days so we're OK to log email address
      logger.info(s"guest account created for email address: $email")
      response.guestRegistrationRequest.userId
    }

  override def getOrCreateIdentityIdFromEmail(email: String): IdentityClient.Result[String] =
    for {
      preExistingIdentityId <- getIdentityIdFromEmail(email)
      // pure lifts the identity id into the monadic context.
      userIdWithGuestAccountCreationToken <- preExistingIdentityId.fold(createGuestAccount(email))(id =>
        Monad[IdentityClient.Result].pure(id),
      )
    } yield userIdWithGuestAccountCreationToken
}

object IdentityService {

  def fromIdentityConfig(config: IdentityConfig)(implicit ws: WSClient, pool: DefaultThreadPool): IdentityService = {
    val guardianIdentityClient = IdentityClient.fromIdentityConfig(config)
    new GuardianIdentityService(guardianIdentityClient)
  }
}
