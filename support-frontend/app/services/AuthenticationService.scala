package services

import com.gu.identity.auth.IdentityClient
import com.gu.identity.auth.IdentityClient.Error
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

  def tryAuthenticateUser(requestHeader: RequestHeader): Future[Option[User]] =
    identityPlayAuthService.getUserFromRequest(requestHeader)
      .map { case (_, user) => user }
      .unsafeToFuture()
      .map(user => Some(user))
      .recover {
        case _: UserCredentialsMissingError =>
          // user not signed in https://github.com/guardian/identity/pull/1578
          None
        case IdentityClient.Errors(List(Error("Access Denied"))) =>
          // scalastyle:off
          // invalid SC_GU_U cookie?
          // https://github.com/guardian/identity/blob/424b5170f1b892778fe94f9b3d9a540fb5181e9d/identity-model/src/main/scala/com/gu/identity/model/Errors.scala#L60
          // scalastyle:on
          None
        case err =>
          // something else went wrong - we should alert on this
          SafeLogger.error(scrub"unable to authorize user", err)
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

}
