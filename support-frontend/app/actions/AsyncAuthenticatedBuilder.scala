package actions

import play.api.mvc.Security.AuthenticatedRequest
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

class AsyncAuthenticatedBuilder[U](
    userinfo: RequestHeader => Future[Option[U]],
    defaultParser: BodyParser[AnyContent],
    onUnauthorized: RequestHeader => Result
)(implicit val executionContext: ExecutionContext)
  extends ActionBuilder[({ type R[A] = AuthenticatedRequest[A, U] })#R, AnyContent] { // scalastyle:ignore

  lazy val parser = defaultParser

  def invokeBlock[A](request: Request[A], block: AuthenticatedRequest[A, U] => Future[Result]): Future[Result] =
    authenticate(request, block)

  /**
    * Authenticate the given block.
    */
  def authenticate[A](request: Request[A], block: AuthenticatedRequest[A, U] => Future[Result]): Future[Result] = {
    userinfo(request).flatMap {
      case Some(user) => block(new AuthenticatedRequest(user, request))
      case None => Future.successful(onUnauthorized(request))
    }.recover { case _ =>
      onUnauthorized(request)
    }
  }
}
