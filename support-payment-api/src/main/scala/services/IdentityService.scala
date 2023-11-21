package services

import cats.Monad
import cats.data.EitherT
import cats.instances.future._
import com.gu.retry.EitherTRetry
import com.gu.retry.EitherTRetry.retry
import com.typesafe.scalalogging.StrictLogging
import conf.IdentityConfig
import model.DefaultThreadPool
import play.api.libs.ws.WSClient
import services.IdentityClient.{ApiError, ContextualError}

import scala.concurrent.Future
import scala.concurrent.duration.DurationInt

trait IdentityService extends StrictLogging {

  // Should return the identity id associated with the email, or an error if there isn't one.
  def getIdentityIdFromEmail(email: String): IdentityClient.Result[String]

  // Should return the identity id of the created account along with an optional guest account token.
  def createGuestAccount(email: String): IdentityClient.Result[String]

  // Look up the identity id for the given email address.
  // If one exists then return it, otherwise create a guest account and return the associated identity id.
  def getOrCreateIdentityIdFromEmail(email: String): IdentityClient.Result[String]

}

// Default implementation of the IdentityService trait using the client to the Guardian identity API.
class GuardianIdentityService(client: IdentityClient)(implicit pool: DefaultThreadPool) extends IdentityService {

  override def getIdentityIdFromEmail(email: String): IdentityClient.Result[String] =
    client.getUser(email).map(response => response.user.id)

  override def createGuestAccount(email: String): EitherT[Future, IdentityClient.ContextualError, String] =
    client.createGuestAccount(email).map { response =>
      // Logs are only retained for 14 days so we're OK to log email address
      logger.info(s"guest account created for email address: $email")
      response.guestRegistrationRequest.userId
    }

  override def getOrCreateIdentityIdFromEmail(
      email: String,
  ): EitherT[Future, IdentityClient.ContextualError, String] = {
    // Try to fetch the user's information with their email address and if it does not exist
    // or there is an error try again up to a total of 3 times with a 500 millisecond delay between
    // each attempt.
    // We try to fetch the user information at the start of each attempt in case a previous `createGuestAccount`
    // call succeeded but timed out before returning a valid response
    retry(
      getIdentityIdFromEmail(email)
        .leftFlatMap(_ => createGuestAccount(email)),
      delay = 500.milliseconds,
      retries = 2,
    )
  }
}

object IdentityService {

  def fromIdentityConfig(config: IdentityConfig)(implicit ws: WSClient, pool: DefaultThreadPool): IdentityService = {
    val guardianIdentityClient = IdentityClient.fromIdentityConfig(config)
    new GuardianIdentityService(guardianIdentityClient)
  }
}
