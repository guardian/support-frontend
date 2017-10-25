package actions

import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

class NoCacheActionBuilder(
  val parser: BodyParser[AnyContent],
  val executionContext: ExecutionContext
)
    extends ActionBuilder[Request, AnyContent] {
  implicit private val ec = executionContext

  override def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]): Future[Result] =
    block(request).map(_.withHeaders(CacheControl.noCache, "Pragma" -> "no-cache", "Expires" -> "0"))

}