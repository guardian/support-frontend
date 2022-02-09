package actions

import play.api.mvc.{ActionBuilder, AnyContent, BodyParser, Request}

import scala.concurrent.ExecutionContext

class NoCacheAction(
    parser: BodyParser[AnyContent],
    executionContext: ExecutionContext,
    headers: List[(String, String)] = List.empty,
)(implicit val ec: ExecutionContext) {
  def apply(): ActionBuilder[Request, AnyContent] = new NoCacheActionBuilder(parser, executionContext, headers)
}
