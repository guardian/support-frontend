package lib.actions

import play.api.libs.concurrent.Execution.Implicits._
import play.api.mvc.{Action, AnyContent, Result}
import scala.concurrent.Future
import lib.httpheaders.CacheControl

object PrivateAction {

  def async[T](block: => Future[Result]): Action[AnyContent] = Action.async {
    block.map(_.withHeaders(CacheControl.noCache))
  }

  def apply[T](block: => Result): Action[AnyContent] = Action {
    block.withHeaders(CacheControl.noCache)
  }
}
