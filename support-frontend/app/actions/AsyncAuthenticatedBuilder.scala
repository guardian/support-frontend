package actions

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import com.gu.identity.model.User
import play.api.mvc.Security.AuthenticatedRequest
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

// scalastyle:off
// This is based on AuthenticatedBuilder in https://github.com/playframework/playframework/blob/1ca9d0af237ac45a011671b2e036d726cd05e4e7/core/play/src/main/scala/play/api/mvc/Security.scala
// The main difference is that this action builder enables authenticating a user asynchronously.
// i.e. RequestHeader => Future[Option[U]] instead of RequestHeader => Option[U]
// In the context of Guardian applications, asynchronous authentication equals making a call to identity API,
// to authenticate the user data.
// TODO: considering porting this to identity-play-auth.
// scalastyle:on
final class AsyncAuthenticatedBuilder(
  userinfo: RequestHeader => Future[Option[User]],
  override val parser: BodyParser[AnyContent]
)(implicit val executionContext: ExecutionContext)
  extends ActionBuilder[OptionalAuthRequest, AnyContent] { // scalastyle:ignore

  override def invokeBlock[BODYTYPE](
    request: Request[BODYTYPE],
    block: AuthenticatedRequest[BODYTYPE, Option[User]] => Future[Result]
  ): Future[Result] =
    for {
      user <- userinfo(request)
      chainedBlockResult <- block(new AuthenticatedRequest(user, request))
    } yield chainedBlockResult

}
object AsyncAuthenticatedBuilder {
  type OptionalAuthRequest[BODYTYPE] = AuthenticatedRequest[BODYTYPE, Option[User]]
}
