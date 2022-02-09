package actions

import org.joda.time.DateTime
import play.api.mvc._
import HttpHeaders.mergeHeader
import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._

class CachedActionBuilder(
    val parser: BodyParser[AnyContent],
    val executionContext: ExecutionContext,
    val maxAge: FiniteDuration,
    val headers: List[(String, String)],
) extends ActionBuilder[Request, AnyContent] {

  implicit private val ec = executionContext
  private val maximumBrowserAge = 1.minute

  override def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]): Future[Result] =
    block(request).map(_.withHeaders(mergeHeader("Vary", cacheHeaders() ++ headers): _*))

  private def cacheHeaders(now: DateTime = DateTime.now): List[(String, String)] = {
    val browserAge = maximumBrowserAge min maxAge
    CacheControl.defaultCacheHeaders(maxAge, browserAge, now)
  }

}
