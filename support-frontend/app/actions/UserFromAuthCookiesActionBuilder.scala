package actions

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.UserFromAuthCookiesActionBuilder.{
  UserClaims,
  responseWithNoUser,
  shouldValidateUser,
  validateUserRemotely,
}
import actions.UserFromAuthCookiesActionBuilder.UserClaims.toUser
import com.gu.identity.auth._
import com.gu.identity.model.{PrivateFields, User}
import config.Identity
import controllers.AuthCodeFlow.FlashKey.authTried
import controllers.AuthCodeFlow.SessionKey.{originUrl, referringUrl}
import controllers.routes
import play.api.Logging
import play.api.http.HeaderNames.REFERER
import play.api.mvc.Results.Redirect
import play.api.mvc.Security.AuthenticatedRequest
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

/** Tries to authenticate the user from ID and access token cookies. Provides a [[User]] to the request if cookies are
  * present and authentication is possible.
  */
class UserFromAuthCookiesActionBuilder(
    override val parser: BodyParser[AnyContent],
    oktaAuthService: OktaAuthService[DefaultAccessClaims, UserClaims],
    config: Identity,
)(implicit val executionContext: ExecutionContext)
    extends ActionBuilder[OptionalAuthRequest, AnyContent]
    with Logging {

  override def invokeBlock[A](request: Request[A], block: OptionalAuthRequest[A] => Future[Result]): Future[Result] =
    shouldValidateUser(config, oktaAuthService)(request, block, _ => responseWithNoUser(config)(request, block))
}

/** Tries to authenticate the user from ID and access token cookies. If there are no cookies, queries the auth server to
  * try to generate them. Provides a [[User]] to the request if authentication is possible.
  */
class UserFromAuthCookiesOrAuthServerActionBuilder(
    override val parser: BodyParser[AnyContent],
    oktaAuthService: OktaAuthService[DefaultAccessClaims, UserClaims],
    config: Identity,
    isAuthServerUp: () => Future[Boolean],
)(implicit val executionContext: ExecutionContext)
    extends ActionBuilder[OptionalAuthRequest, AnyContent]
    with Logging {

  override def invokeBlock[A](request: Request[A], block: OptionalAuthRequest[A] => Future[Result]): Future[Result] = {
    shouldValidateUser(config, oktaAuthService)(
      request,
      block,
      failure => {
        logger.info(s"Request ${request.id} doesn't have valid token cookies: ${failure.message}")
        val alreadyAttempted = request.flash.get(authTried).isDefined
        if (alreadyAttempted) {
          // Already tried to authenticate this request so just pass it through without a user
          responseWithNoUser(config)(request, block)
        } else {
          // Haven't tried to authenticate this request yet so redirect to auth server
          validateUserRemotely(config, isAuthServerUp)(request, block)
        }
      },
    )
  }
}

object UserFromAuthCookiesActionBuilder extends Logging {

  /** Provides an authenticated [[User]] to the given block if authentication is possible. Otherwise, processes the
    * given block without a user.
    */
  def shouldValidateUser[A](config: Identity, oktaAuthService: OktaAuthService[DefaultAccessClaims, UserClaims])(
      request: Request[A],
      block: OptionalAuthRequest[A] => Future[Result],
      handleFailure: ValidationError => Future[Result],
  )(implicit ctx: ExecutionContext): Future[Result] = {
    def isCookiePresent(name: String) = request.cookies.get(name).isDefined
    val isSignedOut = isCookiePresent(config.signedOutCookieName)
    val isSignedIn = isCookiePresent(config.signedInCookieName)
    // If user is signed out or there are no cookies, just pass request through without a user
    if (isSignedOut || !isSignedIn) {
      responseWithNoUser(config)(request, block)
    } else {
      validateUserLocally(config, oktaAuthService)(request).fold(
        handleFailure,
        responseWithUser(request, block),
      )
    }
  }

  /** Validates auth tokens cached in cookies to find a user.
    */
  private def validateUserLocally[A](
      config: Identity,
      oktaAuthService: OktaAuthService[DefaultAccessClaims, UserClaims],
  )(request: Request[A]): Either[ValidationError, User] = {
    val accessScopes = config.oauthScopes.trim.split("\\s+").map(scope => ClientAccessScope(scope)).toList
    for {
      idTokenCookie <- request.cookies
        .get(config.idTokenCookieName)
        .toRight(GenericValidationError("No id token cookie"))
      accessTokenCookie <- request.cookies
        .get(config.accessTokenCookieName)
        .toRight(GenericValidationError("No access token cookie"))
      userClaims <- oktaAuthService.validateIdTokenLocally(IdToken(idTokenCookie.value), nonce = None)
      _ <- oktaAuthService.validateAccessTokenLocally(AccessToken(accessTokenCookie.value), accessScopes)
    } yield toUser(userClaims)
  }

  /** Redirects to auth server to validate user.
    */
  def validateUserRemotely[A](config: Identity, isAuthServerUp: () => Future[Boolean])(
      request: Request[A],
      block: OptionalAuthRequest[A] => Future[Result],
  )(implicit ctx: ExecutionContext): Future[Result] = {
    isAuthServerUp().flatMap {
      case true =>
        val session = {
          val withoutReferrer = request.session + (originUrl -> request.uri)
          request.headers
            .get(REFERER)
            .map(referrer => withoutReferrer + (referringUrl -> referrer))
            .getOrElse(withoutReferrer)
        }
        Future.successful(Redirect(routes.AuthCodeFlowController.authorize()).withSession(session))
      case false =>
        // If auth server is down, just pass request through without a user
        logger.warn(s"Auth server is down, can't authenticate request ${request.id}")
        responseWithNoUser(config)(request, block)
    }
  }

  /** Processes a request that has an authenticated user. */
  private def responseWithUser[A](request: Request[A], block: OptionalAuthRequest[A] => Future[Result])(
      user: User,
  ): Future[Result] =
    block(new AuthenticatedRequest(Some(user), request))

  /** Processes a request that has no authenticated user. */
  def responseWithNoUser[A](
      config: Identity,
  )(request: Request[A], block: OptionalAuthRequest[A] => Future[Result])(implicit
      ctx: ExecutionContext,
  ): Future[Result] = {
    def toDiscardingCookie(cookieName: String) = DiscardingCookie(name = cookieName, secure = true)
    block(new AuthenticatedRequest(None, request)).map(result =>
      // Discard token cookies as we know they're invalid
      result.discardingCookies(
        toDiscardingCookie(config.idTokenCookieName),
        toDiscardingCookie(config.accessTokenCookieName),
      ),
    )
  }

  case class UserClaims(
      primaryEmailAddress: String,
      identityId: String,
      firstName: Option[String],
      lastName: Option[String],
  ) extends IdentityClaims

  object UserClaims {

    val parser: IdentityClaimsParser[UserClaims] = new IdentityClaimsParser[UserClaims] {

      // Not used
      override protected def fromDefaultAndRaw(
          defaultClaims: DefaultIdentityClaims,
          rawClaims: JsonString,
      ): Either[ValidationError, UserClaims] = throw new UnsupportedOperationException()

      override protected def fromDefaultAndUnparsed(
          defaultClaims: DefaultIdentityClaims,
          unparsedClaims: UnparsedClaims,
      ): Either[ValidationError, UserClaims] =
        Right(
          UserClaims(
            primaryEmailAddress = defaultClaims.primaryEmailAddress,
            identityId = defaultClaims.identityId,
            firstName = unparsedClaims.getOptional("first_name"),
            lastName = unparsedClaims.getOptional("last_name"),
          ),
        )
    }

    def toUser(claims: UserClaims): User = User(
      id = claims.identityId,
      primaryEmailAddress = claims.primaryEmailAddress,
      privateFields = PrivateFields(
        firstName = claims.firstName,
        secondName = claims.lastName,
      ),
    )
  }

  case class ClientAccessScope(name: String) extends AccessScope
}
