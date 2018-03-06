package services

import cats.Monad
import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.ws.WSClient

import conf.IdentityConfig
import model.DefaultThreadPool
import services.IdentityClient.ApiError

trait IdentityService extends StrictLogging {

  // Should return the identity id associated with the email, or None if there isn't one.
  def getIdentityIdFromEmail(email: String): IdentityClient.Result[Option[Long]]

  // Should return the identity id of the created account.
  def createGuestAccount(email: String): IdentityClient.Result[Long]

  // TODO: better method name
  // Look up the identity id for the given email address.
  // If one exists then return it, otherwise create a guest account and return the associated identity id.
  def getOrCreateIdentityIdFromEmail(email: String)(implicit pool: DefaultThreadPool): IdentityClient.Result[Long] =
    for {
      preExistingIdentityId <- getIdentityIdFromEmail(email)
      // pure lifts the identity id into the monadic context.
      identityId <- preExistingIdentityId.fold(createGuestAccount(email))(Monad[IdentityClient.Result].pure(_))
    } yield identityId
}

// Default implementation of the IdentityService trait using the client to the Guardian identity API.
class GuardianIdentityService (client: IdentityClient)(implicit pool: DefaultThreadPool) extends IdentityService {

  override def getIdentityIdFromEmail(email: String): IdentityClient.Result[Option[Long]] =
    client.getUser(email).map(response => Option(response.user.id)).recover {
      // If the API error was that the result was not found,
      // then we can confidently say there is no identity id for the given email address.
      case err: ApiError if err.isNotFound => Option.empty[Long]
    }

  override def createGuestAccount(email: String): IdentityClient.Result[Long] =
    client.createGuestAccount(email).map { response =>
      // TODO: we might not be able to include email address in log message
      logger.info(s"guest account created for email address: $email")
      response.guestRegistrationRequest.userId
    }

  override def getOrCreateIdentityIdFromEmail(email: String)(implicit pool: DefaultThreadPool): IdentityClient.Result[Long] =
    super.getOrCreateIdentityIdFromEmail(email).leftMap { err =>
      logger.error("error getting or creating identity id", err)
      err
    }
}

object IdentityService {

  def fromIdentityConfig(config: IdentityConfig)(implicit ws: WSClient, pool: DefaultThreadPool): IdentityService = {
    val guardianIdentityClient = IdentityClient.fromIdentityConfig(config)
    new GuardianIdentityService(guardianIdentityClient)
  }
}
