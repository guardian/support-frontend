package actions

import com.gu.identity.play.AuthenticatedIdUser
import com.gu.identity.play.AuthenticatedIdUser.Provider
import com.netaporter.uri.dsl._
import play.api.mvc.Results._
import play.api.mvc.Security.{AuthenticatedBuilder, AuthenticatedRequest}
import play.api.mvc._
import play.filters.csrf._
import services.TestUserService
import utils.RequestCountry

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

object CustomActionBuilders {
  type AuthRequest[A] = AuthenticatedRequest[A, AuthenticatedIdUser]
  type OptionalAuthRequest[A] = AuthenticatedRequest[A, Option[AuthenticatedIdUser]]
}

class CustomActionBuilders(
    authenticatedIdUserProvider: Provider,
    idWebAppUrl: String,
    supportUrl: String,
    testUsers: TestUserService,
    cc: ControllerComponents,
    addToken: CSRFAddToken,
    checkToken: CSRFCheck,
    csrfConfig: CSRFConfig
)(implicit private val ec: ExecutionContext) {

  import CustomActionBuilders._

  val membersIdentityClientId = "members"

  val recurringIdentityClientId = "recurringContributions"

  // Tells identity to send users back to the checkout immediately after sign-up.
  private val idSkipConfirmation: (String, String) = "skipConfirmation" -> "true"
  // Prevents the identity validation email sending users back to our checkout.
  private val idSkipValidationReturn: (String, String) = "skipValidationReturn" -> "true"

  private def idWebAppRegisterUrl(path: String, clientId: String, idWebAppRegisterPath: String): String =
    idWebAppUrl / idWebAppRegisterPath ? ("returnUrl" -> s"$supportUrl$path") & idSkipConfirmation & idSkipValidationReturn & "clientId" -> clientId

  def chooseRegister(identityClientId: String): RequestHeader => Result = request => {
    SeeOther(idWebAppRegisterUrl(request.uri, identityClientId, "register"))
  }

  def chooseSignInStart(identityClientId: String): RequestHeader => Result = request => {
    SeeOther(idWebAppRegisterUrl(request.uri, identityClientId, "signin/start"))
  }

  private def maybeAuthenticated(onUnauthenticated: RequestHeader => Result): ActionBuilder[OptionalAuthRequest, AnyContent] =
    new AuthenticatedBuilder(authenticatedIdUserProvider.andThen(Some.apply), cc.parsers.defaultBodyParser, onUnauthenticated)

  private def authenticated(onUnauthenticated: RequestHeader => Result): ActionBuilder[AuthRequest, AnyContent] =
    new AuthenticatedBuilder(authenticatedIdUserProvider, cc.parsers.defaultBodyParser, onUnauthenticated)

  private def authenticatedTestUser(onUnauthenticated: RequestHeader => Result): ActionBuilder[AuthRequest, AnyContent] =
    new AuthenticatedBuilder(
      userinfo = authenticatedIdUserProvider.andThen(_.filter(user => testUsers.isTestUser(user.user.displayName))),
      defaultParser = cc.parsers.defaultBodyParser,
      onUnauthorized = onUnauthenticated
    )

  val PrivateAction = new PrivateActionBuilder(addToken, checkToken, csrfConfig, cc.parsers.defaultBodyParser, cc.executionContext)

  def authenticatedAction(identityClientId: String = membersIdentityClientId, useNewSignIn: Boolean = false): ActionBuilder[AuthRequest, AnyContent] = {
    val registerFunction = if (useNewSignIn) chooseSignInStart(identityClientId) else chooseRegister(identityClientId)
    PrivateAction andThen authenticated(registerFunction)
  }

  def authenticatedTestUserAction(identityClientId: String = membersIdentityClientId): ActionBuilder[AuthRequest, AnyContent] =
    PrivateAction andThen authenticatedTestUser(chooseRegister(identityClientId))

  def maybeAuthenticatedAction(identityClientId: String = membersIdentityClientId): ActionBuilder[OptionalAuthRequest, AnyContent] =
    PrivateAction andThen maybeAuthenticated(chooseRegister(identityClientId))

  val CachedAction = new CachedAction(cc.parsers.defaultBodyParser, cc.executionContext)

  val NoCacheAction = new NoCacheAction(cc.parsers.defaultBodyParser, cc.executionContext)

  val GeoTargetedCachedAction = new CachedAction(
    cc.parsers.defaultBodyParser,
    cc.executionContext,
    List("Vary" -> RequestCountry.fastlyCountryHeader)
  )

}
