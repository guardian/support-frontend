package actions

import play.api.mvc._

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

class CachedAction(
    parser: BodyParser[AnyContent],
    executionContext: ExecutionContext,
    headers: List[(String, String)] = List.empty,
)(implicit val ec: ExecutionContext) {

  private val defaultMaxAge = 1.minute

  def apply(maxAge: FiniteDuration): ActionBuilder[Request, AnyContent] =
    new CachedActionBuilder(parser, executionContext, maxAge, headers)

  def apply(): ActionBuilder[Request, AnyContent] = apply(defaultMaxAge)
}
