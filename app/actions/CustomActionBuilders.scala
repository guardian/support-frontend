package actions

import com.gu.identity.play.AuthenticatedIdUser
import com.gu.identity.play.AuthenticatedIdUser.Provider
import com.netaporter.uri.dsl._
import play.api.mvc.Results._
import play.api.mvc.Security.{AuthenticatedBuilder, AuthenticatedRequest}
import play.api.mvc._
import play.filters.csrf._
import services.TestUserService
import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

object CustomActionBuilders {
  type AuthRequest[A] = AuthenticatedRequest[A, AuthenticatedIdUser]
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

  private val idSkipConfirmation: (String, String) = "skipConfirmation" -> "true"

  private val idMember = "clientId" -> "members"

  private def idWebAppRegisterUrl(path: String): String =
    idWebAppUrl / "register" ? ("returnUrl" -> s"$supportUrl$path") & idSkipConfirmation & idMember

  private val chooseRegister = (request: RequestHeader) => SeeOther(idWebAppRegisterUrl(request.uri))

  private def authenticated(onUnauthenticated: RequestHeader => Result = chooseRegister): ActionBuilder[AuthRequest, AnyContent] =
    new AuthenticatedBuilder(authenticatedIdUserProvider, cc.parsers.defaultBodyParser, onUnauthenticated)

  private def authenticatedTestUser(onUnauthenticated: RequestHeader => Result = chooseRegister): ActionBuilder[AuthRequest, AnyContent] =
    new AuthenticatedBuilder(
      userinfo = authenticatedIdUserProvider.andThen(_.filter(user => testUsers.isTestUser(user.user.displayName))),
      defaultParser = cc.parsers.defaultBodyParser,
      onUnauthorized = onUnauthenticated
    )

  val PrivateAction = new ActionBuilder[Request, AnyContent] {

    override def composeAction[A](action: Action[A]) = new CSRFAction(action, csrfConfig, addToken, checkToken)

    override def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]) = block(request).map(_.withHeaders(CacheControl.noCache))

    override def parser: BodyParser[AnyContent] = cc.parsers.defaultBodyParser

    override protected def executionContext: ExecutionContext = cc.executionContext
  }

  val AuthenticatedAction = PrivateAction andThen authenticated()

  val AuthenticatedTestUserAction = PrivateAction andThen authenticatedTestUser()

  val CachedAction = new CachedAction(cc.parsers.defaultBodyParser, cc.executionContext)
}
