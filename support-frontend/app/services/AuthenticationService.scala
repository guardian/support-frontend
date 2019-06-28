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

class AsyncAuthenticationService(
  authenticationService: AuthenticationService,
  testUserService: TestUserService
)(implicit ec: ExecutionContext) {

  def authenticateUser(requestHeader: RequestHeader): Future[Option[AuthenticatedIdUser]] =
    Future.successful(authenticationService.authenticatedUserFor(requestHeader))

  def authenticateTestUser(requestHeader: RequestHeader): Future[Option[AuthenticatedIdUser]] =
    authenticateUser(requestHeader).map(_.filter(user => testUserService.isTestUser(user.user.displayName)))
}
