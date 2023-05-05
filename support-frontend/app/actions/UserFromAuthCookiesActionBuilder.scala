package actions

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.UserFromAuthCookiesActionBuilder.UserClaims.toUser
import actions.UserFromAuthCookiesActionBuilder.{ClientAccessScope, UserClaims}
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

/** Tries to authenticate the user from ID and access token cookies. Provides a [[User]] to the request if
  * authentication is possible.
  *
  * @param parser
  *   To parse the request body, if any
  * @param oktaAuthService
  *   To validate ID and access token cookies
  * @param config
  *   Auth config
  * @param executionContext
  *   Execution context to run the action in
  */
class UserFromAuthCookiesActionBuilder(
    override val parser: BodyParser[AnyContent],
    oktaAuthService: OktaAuthService[DefaultAccessClaims, UserClaims],
    config: Identity,
)(implicit val executionContext: ExecutionContext)
    extends ActionBuilder[OptionalAuthRequest, AnyContent]
    with Logging {

  override def invokeBlock[A](request: Request[A], block: OptionalAuthRequest[A] => Future[Result]): Future[Result] = {

    def processRequestWithoutUser() = {
      def toDiscardingCookie(cookieName: String) = DiscardingCookie(name = cookieName, secure = true)
      block(new AuthenticatedRequest(None, request)).map(result =>
        // Discard token cookies as we know they're invalid
        result.discardingCookies(
          toDiscardingCookie(config.idTokenCookieName),
          toDiscardingCookie(config.accessTokenCookieName),
        ),
      )
    }

    if (request.cookies.get(config.signedOutCookieName).isDefined) {
      processRequestWithoutUser()
    } else {

      val accessScopes = config.oauthScopes.split(" ").map(scope => ClientAccessScope(scope)).toList

      val result: Either[ValidationError, Future[Result]] = for {
        idTokenCookie <- request.cookies
          .get(config.idTokenCookieName)
          .toRight(GenericValidationError("No id token cookie"))
        accessTokenCookie <- request.cookies
          .get(config.accessTokenCookieName)
          .toRight(GenericValidationError("No access token cookie"))
        userClaims <- oktaAuthService.validateIdTokenLocally(IdToken(idTokenCookie.value), nonce = None)
        _ <- oktaAuthService.validateAccessTokenLocally(AccessToken(accessTokenCookie.value), accessScopes)
      } yield block(new AuthenticatedRequest(Some(toUser(userClaims)), request))

      result.fold(
        failure => {
          logger.info(s"Request ${request.id} doesn't have valid token cookies: ${failure.message}")
          if (request.flash.get(authTried).isDefined) {
            // Already tried to authenticate this request so just pass it through without a user
            processRequestWithoutUser()
          } else {
            // Haven't tried to authenticate this request yet so redirect to auth
            val session = request.session + (originUrl -> request.uri)
            Future.successful(Redirect(routes.AuthCodeFlowController.authorize()).withSession(session))
          }
        },
        identity,
      )
    }
  }
}

object UserFromAuthCookiesActionBuilder {

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
