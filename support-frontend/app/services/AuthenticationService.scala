package services

import com.gu.identity.cookie.IdentityKeys
import com.gu.identity.play.AccessCredentials.{Cookies, Token}
import com.gu.identity.play.AuthenticatedIdUser
import com.gu.identity.play.AuthenticatedIdUser._
import play.api.mvc.RequestHeader

import scala.concurrent.{ExecutionContext, Future}

object AuthenticationService {
  def apply(identityKeys: IdentityKeys, testUserService: TestUserService): AuthenticationService =
    new AuthenticationService(identityKeys, testUserService)
}

class AuthenticationService(override val identityKeys: IdentityKeys, testUserService: TestUserService) extends com.gu.identity.play.AuthenticationService {

  override lazy val authenticatedIdUserProvider: Provider =
    Cookies.authProvider(identityKeys).withDisplayNameProvider(Token.authProvider(identityKeys, "membership"))

  def asyncAuthenticatedIdUserProvider(requestHeader: RequestHeader): Future[Option[AuthenticatedIdUser]] =
    Future.successful(authenticatedIdUserProvider(requestHeader))

  def asyncAuthenticatedTestIdUserProvider(requestHeader: RequestHeader)(implicit ec: ExecutionContext): Future[Option[AuthenticatedIdUser]] =
    asyncAuthenticatedIdUserProvider(requestHeader).map(_.filter(user => testUserService.isTestUser(user.user.displayName)))
}
