package services

import cats.implicits._
import com.gu.identity.auth.IdentityClient.Error
import com.gu.identity.auth.{IdentityClient, UserCredentials}
import com.gu.identity.model.User
import com.gu.identity.play.IdentityPlayAuthService
import com.gu.identity.play.IdentityPlayAuthService.UserCredentialsMissingError
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import config.Identity
import org.http4s.Uri
import play.api.mvc.{Cookie, RequestHeader}

import scala.concurrent.{ExecutionContext, Future}

// The following classes were previously defined in identity-play-auth,
// but have been removed as part of the changes to that library:
// authenticating users via a call to identity API; removing periphery functionality.
// They have been redefined here to reduce diff across PRs,
// but these classes could get refactored / simplified / removed in subsequent PRs.
sealed trait AccessCredentials
object AccessCredentials {
  case class Cookies(scGuU: String, guU: Option[String] = None) extends AccessCredentials {
    val cookies: Seq[Cookie] = Seq(
      Cookie(name = "SC_GU_U", scGuU)
    ) ++ guU.map(c => Cookie(name = "GU_U", c))
  }
  case class Token(tokenText: String) extends AccessCredentials
}

class AsyncAuthenticationService(identityPlayAuthService: IdentityPlayAuthService)(implicit ec: ExecutionContext) {

  import AsyncAuthenticationService._

  def tryAuthenticateUser(requestHeader: RequestHeader): Future[Option[User]] =
    identityPlayAuthService.getUserFromRequest(requestHeader)
          .map { case (_, user) => user }
          .unsafeToFuture()
      .map(user => Some(user))
      .recover {
        case _: UserCredentialsMissingError => None // user not signed in
        case IdentityClient.Errors(List(Error("Access Denied"))) => None // invalid SC_GU_U cookie?
        case err => // something else went wrong - we should alert on this
          logUserAuthenticationError(err)
          None
      }

}

object AsyncAuthenticationService {

  case class IdentityIdAndEmail(id: String, primaryEmailAddress: String)

  def apply(config: Identity, testUserService: TestUserService)(implicit ec: ExecutionContext): AsyncAuthenticationService = {
    val apiUrl = Uri.unsafeFromString(config.apiUrl)
    // TOOD: targetClient could probably be None - check and release in subsequent PR.
    val identityPlayAuthService = IdentityPlayAuthService.unsafeInit(apiUrl, config.apiClientToken, targetClient = Some("membership"))
    new AsyncAuthenticationService(identityPlayAuthService)
  }

  // Logs failure to authenticate a user.
  // User shouldn't necessarily be signed in,
  // in which case, don't log failure to authenticate as an error.
  // All other failures are considered errors.
  def logUserAuthenticationError(error: Throwable): Unit =
    error match {
      // Utilises the custom error introduced in: https://github.com/guardian/identity/pull/1578
      case _: UserCredentialsMissingError => // user not signed in
      case _ => SafeLogger.error(scrub"unable to authorize user", error)
    }
}
