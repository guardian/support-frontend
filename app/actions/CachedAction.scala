package actions

import org.joda.time.DateTime
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._

class CachedAction(actionBuilder: ActionBuilder[Request, AnyContent])(implicit val ec: ExecutionContext) {

  val defaultMaxAge = 1.minute
  val maximumBrowserAge = 1.minute

  def async[T](block: => Future[Result]): Action[AnyContent] = async(defaultMaxAge)(block)

  def apply[T](block: => Result): Action[AnyContent] = apply(defaultMaxAge)(block)

  def async[T](maxAge: FiniteDuration)(block: => Future[Result]): Action[AnyContent] = actionBuilder.async {
    block.map(_.withHeaders(cacheHeaders(maxAge): _*))
  }

  def apply[T](maxAge: FiniteDuration)(block: => Result): Action[AnyContent] = actionBuilder {
    block.withHeaders(cacheHeaders(maxAge): _*)
  }

  private def cacheHeaders(maxAge: FiniteDuration, now: DateTime = DateTime.now): List[(String, String)] = {
    val browserAge = maximumBrowserAge min maxAge
    CacheControl.defaultCacheHeaders(maxAge, browserAge, now)
  }

}
