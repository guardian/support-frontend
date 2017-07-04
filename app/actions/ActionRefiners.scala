package actions

import com.gu.identity.play.AuthenticatedIdUser
import com.gu.identity.play.AuthenticatedIdUser.Provider
import com.netaporter.uri.dsl._
import play.api.mvc.Results._
import play.api.mvc.Security.{AuthenticatedBuilder, AuthenticatedRequest}
import play.api.mvc._
import services.TestUserService

import scala.concurrent.{ExecutionContext, Future}

object ActionRefiners {
  type AuthRequest[A] = AuthenticatedRequest[A, AuthenticatedIdUser]
}

class ActionRefiners(
    authenticatedIdUserProvider: Provider,
    idWebAppUrl: String,
    supportUrl: String,
    testUsers: TestUserService,
    cc: ControllerComponents
)(implicit private val ec: ExecutionContext) {

  import ActionRefiners._

  private val idSkipConfirmation: (String, String) = "skipConfirmation" -> "true"

  private val idMember = "clientId" -> "members"

  private def idWebAppRegisterUrl(path: String): String =
    idWebAppUrl / "register" ? ("returnUrl" -> s"$supportUrl$path") & idSkipConfirmation & idMember

  private val chooseRegister = (request: RequestHeader) => SeeOther(idWebAppRegisterUrl(request.uri))

  private def resultModifier(f: Result => Result): ActionBuilder[Request, AnyContent] = new ActionBuilder[Request, AnyContent] {
    def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]) = block(request).map(f)

    override def parser: BodyParser[AnyContent] = cc.parsers.defaultBodyParser

    override protected def executionContext: ExecutionContext = cc.executionContext
  }

  private def authenticated(onUnauthenticated: RequestHeader => Result = chooseRegister): ActionBuilder[AuthRequest, AnyContent] =
    new AuthenticatedBuilder(authenticatedIdUserProvider, cc.parsers.defaultBodyParser, onUnauthenticated)

  private def authenticatedTestUser(onUnauthenticated: RequestHeader => Result = chooseRegister): ActionBuilder[AuthRequest, AnyContent] =
    new AuthenticatedBuilder(
      userinfo = authenticatedIdUserProvider.andThen(_.filter(user => testUsers.isTestUser(user.user.displayName))),
      defaultParser = cc.parsers.defaultBodyParser,
      onUnauthorized = onUnauthenticated
    )

  val PrivateAction = resultModifier(_.withHeaders(CacheControl.noCache))

  val AuthenticatedAction = PrivateAction andThen authenticated()

  val AuthenticatedTestUserAction = PrivateAction andThen authenticatedTestUser()
}
