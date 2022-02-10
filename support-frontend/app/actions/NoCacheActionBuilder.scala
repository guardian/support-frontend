package actions

import play.api.mvc._
import scala.concurrent.{ExecutionContext, Future}
import HttpHeaders.mergeHeader

class NoCacheActionBuilder(
    val parser: BodyParser[AnyContent],
    val executionContext: ExecutionContext,
    val headers: List[(String, String)],
) extends ActionBuilder[Request, AnyContent] {
  implicit private val ec = executionContext

  override def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]): Future[Result] =
    block(request).map(_.withHeaders(mergeHeader("Vary", List(CacheControl.noCache) ++ headers): _*))

}
