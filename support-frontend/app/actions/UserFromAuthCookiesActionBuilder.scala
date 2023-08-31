package actions

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.UserFromAuthCookiesActionBuilder.UserClaims.toUser
import actions.UserFromAuthCookiesActionBuilder.{processRequestWithoutUser, tryToProcessRequest}
import com.gu.identity.auth._
import com.gu.identity.model.{PrivateFields, User}
import config.Identity
import controllers.AuthCodeFlow.FlashKey.authTried
import controllers.AuthCodeFlow.SessionKey.originUrl
import controllers.routes
import play.api.Logging
import play.api.mvc.Results.Redirect
import play.api.mvc.Security.AuthenticatedRequest
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

/** Tries to authenticate the user from ID and access token cookies. Provides a [[User]] to the request if cookies are
  * present and authentication is possible.
  */
class UserFromAuthCookiesActionBuilder(
    override val parser: BodyParser[AnyContent],
    oktaAuthService: OktaAuthService,
    config: Identity,
)(implicit val executionContext: ExecutionContext)
    extends ActionBuilder[OptionalAuthRequest, AnyContent]
    with Logging {

  override def invokeBlock[A](request: Request[A], block: OptionalAuthRequest[A] => Future[Result]): Future[Result] =
    if (request.cookies.get(config.signedOutCookieName).isDefined) {
      processRequestWithoutUser(config)(request, block)
    } else {
      val result = tryToProcessRequest(config, oktaAuthService)(request, block)
      result.left.map(_ => processRequestWithoutUser(config)(request, block)).merge
    }
}

/** Tries to authenticate the user from ID and access token cookies. If there are no cookies, queries the auth server to
  * try to generate them. Provides a [[User]] to the request if authentication is possible.
  */
class UserFromAuthCookiesOrAuthServerActionBuilder(
    override val parser: BodyParser[AnyContent],
    oktaAuthService: OktaAuthService,
    config: Identity,
    isAuthServerUp: () => Future[Boolean],
)(implicit val executionContext: ExecutionContext)
    extends ActionBuilder[OptionalAuthRequest, AnyContent]
    with Logging {

  override def invokeBlock[A](request: Request[A], block: OptionalAuthRequest[A] => Future[Result]): Future[Result] =
    if (request.cookies.get(config.signedOutCookieName).isDefined) {
      processRequestWithoutUser(config)(request, block)
    } else {
      val result = tryToProcessRequest(config, oktaAuthService)(request, block)
      result.left
        .map(failure => {
          logger.info(s"Request ${request.id} doesn't have valid token cookies: ${failure.message}")
          if (request.flash.get(authTried).isDefined) {
            // Already tried to authenticate this request so just pass it through without a user
            processRequestWithoutUser(config)(request, block)
          } else {
            // Haven't tried to authenticate this request yet so redirect to auth
            isAuthServerUp().flatMap {
              case true =>
                val session = request.session + (originUrl -> request.uri)
                Future.successful(Redirect(routes.AuthCodeFlowController.authorize()).withSession(session))
              case false =>
                // If auth server is down, just pass request through without a user
                logger.warn(s"Auth server is down, can't authenticate request ${request.id}")
                processRequestWithoutUser(config)(request, block)
            }
          }
        })
        .merge
    }
}

object UserFromAuthCookiesActionBuilder {

  /** Processes a request where the [[OptionalAuthRequest]] doesn't have a user. */
  def processRequestWithoutUser[A](
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

  /** Tries to process a request with the given block. If the request doesn't have valid token cookies, returns a
    * [[ValidationError]].
    */
  def tryToProcessRequest[A](
      config: Identity,
      oktaAuthService: OktaAuthService,
  )(request: Request[A], block: OptionalAuthRequest[A] => Future[Result]): Either[ValidationError, Future[Result]] = {
    implicit val userParser: IdentityClaimsParser[UserClaims] = UserClaims.parser
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
    } yield block(new AuthenticatedRequest(Some(toUser(userClaims)), request))
  }

  case class UserClaims(
      primaryEmailAddress: String,
      identityId: String,
      firstName: Option[String],
      lastName: Option[String],
  ) extends IdentityClaims

  object UserClaims {

    val parser: IdentityClaimsParser[UserClaims] = unparsedClaims =>
      for {
        emailAddress <- IdentityClaimsParser.primaryEmailAddress(unparsedClaims)
        idnttyId <- IdentityClaimsParser.identityId(unparsedClaims)
      } yield UserClaims(
        primaryEmailAddress = emailAddress,
        identityId = idnttyId,
        firstName = unparsedClaims.getOptional("first_name"),
        lastName = unparsedClaims.getOptional("last_name"),
      )

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
