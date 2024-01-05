package actions
import actions.UserFromAuthCookiesActionBuilder.{ClientAccessScope, UserClaims}
import com.gu.identity.auth.{AccessToken, DefaultAccessClaims, GenericValidationError, IdToken, OktaAuthService}
import com.gu.identity.model.{PrivateFields, User}
import config.{Identity => IdentityConfig}
import controllers.AuthCodeFlow.FlashKey.authTried
import controllers.AuthCodeFlow.SessionKey.{originUrl, referringUrl}
import controllers.routes
import lib.PlayImplicits.RichRequest
import play.api.Logging
import play.api.mvc.Results.Redirect
import play.api.mvc._
import play.api.http.HeaderNames.REFERER
import scala.concurrent.{ExecutionContext, Future}

class AuthUserRequest[A](val user: Option[User], request: Request[A]) extends WrappedRequest[A](request)

class AuthUserActionBuilder(
    override val parser: BodyParser[AnyContent],
    identityConfig: IdentityConfig,
    oktaAuthService: OktaAuthService[DefaultAccessClaims, UserClaims],
)(implicit
    val executionContext: ExecutionContext,
) extends ActionBuilder[AuthUserRequest, AnyContent]
    with Logging {

  def invokeBlock[A](request: Request[A], block: AuthUserRequest[A] => Future[Result]) = {

    /** Is the user isn't signed in, skip trying to fetch them */
    val isSignedIn = request.cookies.get("GU_U").isDefined

    if (!isSignedIn) {
      block(new AuthUserRequest(None, request))
    } else {

      /** Fetch a user locally if possible */
      val accessScopes = identityConfig.oauthScopes.trim.split("\\s+").map(scope => ClientAccessScope(scope)).toList
      val localUser = for {
        // We need both cookies to fetch a user locally
        idTokenCookie <- request.cookies
          .get("GU_ID_TOKEN")
          .toRight(GenericValidationError("Missing GU_ID_TOKEN cookie"))
        accessTokenCookie <- request.cookies
          .get("GU_ACCESS_TOKEN")
          .toRight(GenericValidationError("Missing GU_ACCESS_TOKEN cookie"))
        claims <- oktaAuthService.validateIdTokenLocally(IdToken(idTokenCookie.value), nonce = None)
        _ <- oktaAuthService.validateAccessTokenLocally(AccessToken(accessTokenCookie.value), accessScopes)
      } yield User(
        id = claims.identityId,
        primaryEmailAddress = claims.primaryEmailAddress,
        privateFields = PrivateFields(
          firstName = claims.firstName,
          secondName = claims.lastName,
        ),
      )

      /** If we can't fetch a user locally, redirect them to the auth URL if it's enable and the auth server is up */
      localUser.fold(
        err => {
          logger.info(s"[UserAction] [${request.uuid}] failed to fetch local user because ${err.message}")
          block(new AuthUserRequest(None, request)).map(result =>
            result.discardingCookies(
              DiscardingCookie(name = "GU_ID_TOKEN", secure = true),
              DiscardingCookie(name = "GU_ACCESS_TOKEN", secure = true),
            ),
          )
        },
        localUser => {
          block(new AuthUserRequest(Some(localUser), request))
        },
      )
    }
  }
}

/** We have seperated the logic to in/exclude the redirect for the use-case of form submission. If a form is submitted
  * and the auth-tokens have expired, it would be a poor UX redirecting the person through the auth flow.
  */
object AuthUserActionBuilder {

  /** This ActionRefiner looks for a user on the response (`AuthUserResponse`).
    *
    * If it is missing, it returns a redirect to the remote auth server.
    *
    * If it exists is returns the original `AuthUserResponse`.
    */
  def withRemoteAuthRedirect(isAuthServerUp: Future[Boolean])(implicit ec: ExecutionContext) =
    new ActionRefiner[AuthUserRequest, AuthUserRequest] {
      def executionContext = ec

      def refine[A](request: AuthUserRequest[A]): Future[Either[Result, AuthUserRequest[A]]] = {

        /** Is the user isn't signed in, skip trying to fetch them */
        val isSignedIn = request.cookies.get("GU_U").isDefined

        /** This is set if the user is coming from an auth redirect, and will avoid an infinite loop. It is set in the
          * `AuthFlowController`.
          */
        val hasTriedToAuth = request.flash.get(authTried).isDefined
        if (!isSignedIn || request.user.isDefined || hasTriedToAuth) {
          Future.successful(Right(request))
        } else {
          isAuthServerUp map {
            case true =>
              val session = {
                val withoutReferrer = request.session + (originUrl -> request.uri)
                request.headers
                  .get(REFERER)
                  .map(referrer => withoutReferrer + (referringUrl -> referrer))
                  .getOrElse(withoutReferrer)
              }
              Left(Redirect(routes.AuthCodeFlowController.authorize()).withSession(session))
            case false => Right(request)
          }
        }
      }
    }
}
