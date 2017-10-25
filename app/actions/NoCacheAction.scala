package actions

import play.api.mvc._

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

class NoCacheAction(
    parser: BodyParser[AnyContent],
    executionContext: ExecutionContext
)(implicit val ec: ExecutionContext) {
  def apply(): ActionBuilder[Request, AnyContent] =
    new NoCacheActionBuilder(parser, executionContext)
}
