package actions

import com.gu.identity.play.AuthenticatedIdUser
import com.netaporter.uri.dsl._
import config.Configuration.IdentityUrl
import play.api.mvc.Results._
import play.api.mvc.Security.{AuthenticatedBuilder, AuthenticatedRequest}
import play.api.mvc._
import play.filters.csrf._
import services.{AuthenticationService, TestUserService}
import utils.RequestCountry

import scala.concurrent.{ExecutionContext, Future}

object CustomActionBuilders {
  type AuthRequest[A] = AuthenticatedRequest[A, AuthenticatedIdUser]
  type OptionalAuthRequest[A] = AuthenticatedRequest[A, Option[AuthenticatedIdUser]]
  type AnyAuthRequest[A] = AuthenticatedRequest[A, _]
}

class CustomActionBuilders(
  authenticationService: AuthenticationService,
  idWebAppUrl: IdentityUrl,
  supportUrl: String,
  cc: ControllerComponents,
  addToken: CSRFAddToken,
  checkToken: CSRFCheck,
  csrfConfig: CSRFConfig
)(implicit private val ec: ExecutionContext) {

  import CustomActionBuilders._

  val membersIdentityClientId = "members"
  val subscriptionsClientId = "subscriptions"
  val recurringIdentityClientId = "recurringContributions"

  // Tells identity to send users back to the checkout immediately after sign-up.
  private val idSkipConfirmation: (String, String) = "skipConfirmation" -> "true"
  // Prevents the identity validation email sending users back to our checkout.
  private val idSkipValidationReturn: (String, String) = "skipValidationReturn" -> "true"

  private def idWebAppRegisterUrl(path: String, clientId: String, idWebAppRegisterPath: String): String =
    idWebAppUrl.value / idWebAppRegisterPath ?
      ("returnUrl" -> s"$supportUrl$path") &
      idSkipConfirmation &
      idSkipValidationReturn &
      "clientId" -> clientId

  def onUnauthenticated(identityClientId: String): RequestHeader => Result = request => {
    SeeOther(idWebAppRegisterUrl(request.uri, identityClientId, "signin"))
  }

  private def maybeAuthenticated(onUnauthenticated: RequestHeader => Result): ActionBuilder[OptionalAuthRequest, AnyContent] =
    new AsyncAuthenticatedBuilder(
      userinfo = requestHeader => authenticationService.asyncAuthenticatedIdUserProvider(requestHeader).map(Some.apply),
      cc.parsers.defaultBodyParser,
      onUnauthenticated
    )

  private def authenticated(onUnauthenticated: RequestHeader => Result): ActionBuilder[AuthRequest, AnyContent] =
    new AsyncAuthenticatedBuilder(authenticationService.asyncAuthenticatedIdUserProvider, cc.parsers.defaultBodyParser, onUnauthenticated)

  private def authenticatedTestUser(onUnauthenticated: RequestHeader => Result): ActionBuilder[AuthRequest, AnyContent] =
    new AsyncAuthenticatedBuilder(
      userinfo = authenticationService.asyncAuthenticatedTestIdUserProvider,
      defaultParser = cc.parsers.defaultBodyParser,
      onUnauthorized = onUnauthenticated
    )

  val PrivateAction = new PrivateActionBuilder(addToken, checkToken, csrfConfig, cc.parsers.defaultBodyParser, cc.executionContext)

  def authenticatedAction(identityClientId: String = membersIdentityClientId): ActionBuilder[AuthRequest, AnyContent] = {
    PrivateAction andThen authenticated(onUnauthenticated(identityClientId))
  }

  def authenticatedTestUserAction(identityClientId: String = membersIdentityClientId): ActionBuilder[AuthRequest, AnyContent] =
    PrivateAction andThen authenticatedTestUser(onUnauthenticated(identityClientId))

  def maybeAuthenticatedAction(identityClientId: String = membersIdentityClientId): ActionBuilder[OptionalAuthRequest, AnyContent] =
    PrivateAction andThen maybeAuthenticated(onUnauthenticated(identityClientId))

  val CachedAction = new CachedAction(cc.parsers.defaultBodyParser, cc.executionContext)

  val NoCacheAction = new NoCacheAction(cc.parsers.defaultBodyParser, cc.executionContext)

  val GeoTargetedCachedAction = new CachedAction(
    cc.parsers.defaultBodyParser,
    cc.executionContext,
    List("Vary" -> RequestCountry.fastlyCountryHeader)
  )

}
