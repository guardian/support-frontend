package lib.actions

import org.joda.time.DateTime
import play.api.libs.concurrent.Execution.Implicits._
import play.api.mvc.{Action, AnyContent, Result}
import scala.concurrent.Future
import scala.concurrent.duration._
import lib.httpheaders._

object CachedAction {

  val defaultMaxAge = 1.minute
  val maximumBrowserAge = 1.minute

  def async[T](block: => Future[Result]): Action[AnyContent] = async(defaultMaxAge)(block)

  def apply[T](block: => Result): Action[AnyContent] = apply(defaultMaxAge)(block)

  def async[T](maxAge: FiniteDuration)(block: => Future[Result]): Action[AnyContent] = Action.async {
    block.map(_.withHeaders(cacheHeaders(maxAge): _*))
  }

  def apply[T](maxAge: FiniteDuration)(block: => Result): Action[AnyContent] = Action {
    block.withHeaders(cacheHeaders(maxAge): _*)
  }

  private def cacheHeaders(maxAge: FiniteDuration, now: DateTime = DateTime.now): List[(String, String)] = {
    val browserAge = maximumBrowserAge min maxAge
    CacheControl.defaultCacheHeaders(maxAge, browserAge, now)
  }

}
