package lib.actions

import com.gu.identity.play.AuthenticatedIdUser
import com.gu.identity.play.AuthenticatedIdUser.Provider
import play.api.mvc.Security.{AuthenticatedBuilder, AuthenticatedRequest}
import play.api.mvc.{ActionBuilder, Request, RequestHeader, Result}
import lib.httpheaders.CacheControl
import com.netaporter.uri.dsl._
import lib.TestUsers

import scala.concurrent.Future
import play.api.mvc.Results._

import scala.concurrent.ExecutionContext

object ActionRefiners {
  type AuthRequest[A] = AuthenticatedRequest[A, AuthenticatedIdUser]
}

class ActionRefiners(
    authenticatedIdUserProvider: Provider,
    idWebAppUrl: String,
    supportUrl: String,
    testUsers: TestUsers
)(implicit private val ec: ExecutionContext) {

  import ActionRefiners._

  private val idSkipConfirmation: (String, String) = "skipConfirmation" -> "true"

  private val idMember = "clientId" -> "members"

  private def idWebAppRegisterUrl(path: String): String =
    idWebAppUrl / "register" ? ("returnUrl" -> s"$supportUrl$path") & idSkipConfirmation & idMember

  private val chooseRegister = (request: RequestHeader) => SeeOther(idWebAppRegisterUrl(request.uri))

  private def resultModifier(f: Result => Result): ActionBuilder[Request] = new ActionBuilder[Request] {
    def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]) = block(request).map(f)
  }

  private def authenticated(onUnauthenticated: RequestHeader => Result = chooseRegister): ActionBuilder[AuthRequest] = {
    new AuthenticatedBuilder(authenticatedIdUserProvider, onUnauthenticated)
  }

  private def authenticatedTestUser(onUnauthenticated: RequestHeader => Result = chooseRegister): ActionBuilder[AuthRequest] = {
    new AuthenticatedBuilder(
      authenticatedIdUserProvider.andThen(_.filter(user => testUsers.isTestUser(user.user.displayName))),
      onUnauthenticated
    )
  }

  val PrivateAction = resultModifier(_.withHeaders(CacheControl.noCache))

  val AuthenticatedAction = PrivateAction andThen authenticated()

  val AuthenticatedTestUserAction = PrivateAction andThen authenticatedTestUser()
}
