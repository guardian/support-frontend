package services

import com.gu.identity.cookie.IdentityKeys
import com.gu.identity.play.AccessCredentials.{Cookies, Token}
import com.gu.identity.play.AuthenticatedIdUser
import com.gu.identity.play.AuthenticatedIdUser._
import play.api.mvc.RequestHeader

import scala.concurrent.{ExecutionContext, Future}

class AuthenticationService(override val identityKeys: IdentityKeys) extends com.gu.identity.play.AuthenticationService {
  override lazy val authenticatedIdUserProvider: Provider =
    Cookies.authProvider(identityKeys).withDisplayNameProvider(Token.authProvider(identityKeys, "membership"))
}

// TODO: consider porting this to identity-play-auth.
class AsyncAuthenticationService(
  authenticationService: AuthenticationService,
  testUserService: TestUserService
)(implicit ec: ExecutionContext) {

  // TODO in follow-up PR:
  // authenticate the user by making a call to identity API rather than using underyling authentication service.
  def authenticateUser(requestHeader: RequestHeader): Future[Option[AuthenticatedIdUser]] =
    Future.successful(authenticationService.authenticatedUserFor(requestHeader))

  // TODO in follow-up PR:
  // authenticate the user by making a call to identity API rather than using underyling authentication service.
  def authenticateTestUser(requestHeader: RequestHeader): Future[Option[AuthenticatedIdUser]] =
    authenticateUser(requestHeader).map(_.filter(user => testUserService.isTestUser(user.user.displayName)))
}

object AsyncAuthenticationService {
  def apply(identityKeys: IdentityKeys, testUserService: TestUserService)(implicit ec: ExecutionContext): AsyncAuthenticationService = {
    val authenticationService = new AuthenticationService(identityKeys)
    new AsyncAuthenticationService(authenticationService, testUserService)
  }
}
