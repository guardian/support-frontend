package services

import cats.implicits._
import com.gu.identity.auth.UserCredentials
import com.gu.identity.play.IdentityPlayAuthService
import config.Identity
import org.http4s.Uri
import play.api.mvc.RequestHeader

import scala.concurrent.{ExecutionContext, Future}

// Removed from identity-play-auth
case class IdMinimalUser(id: String, displayName: Option[String])
case class AuthenticatedIdUser(credentials: UserCredentials, user: IdMinimalUser)

// TODO: consider porting this to identity-play-auth.
class AsyncAuthenticationService(
    identityPlayAuthService: IdentityPlayAuthService,
    testUserService: TestUserService
)(implicit ec: ExecutionContext) {

  // TODO in follow-up PR:
  // authenticate the user by making a call to identity API rather than using underyling authentication service.
  def authenticateUser(requestHeader: RequestHeader): Future[AuthenticatedIdUser] =
    identityPlayAuthService.getUserFromRequest(requestHeader)
      .map { case (credentials, user) =>
        AuthenticatedIdUser(credentials, IdMinimalUser(user.id, user.publicFields.displayName))
      }
      .unsafeToFuture()

  // TODO in follow-up PR:
  // authenticate the user by making a call to identity API rather than using underyling authentication service.
  def authenticateTestUser(requestHeader: RequestHeader): Future[AuthenticatedIdUser] =
    authenticateUser(requestHeader).ensure(new RuntimeException("user is not a test user")) { user =>
      testUserService.isTestUser(user.user.displayName)
    }
}

object AsyncAuthenticationService {
  def apply(config: Identity, testUserService: TestUserService)(implicit ec: ExecutionContext): AsyncAuthenticationService = {
    val apiUrl = Uri.unsafeFromString(config.apiUrl)
    val identityPlayAuthService = IdentityPlayAuthService(apiUrl, config.apiClientToken)
    new AsyncAuthenticationService(identityPlayAuthService, testUserService)
  }
}
