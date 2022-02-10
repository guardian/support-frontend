package actions

import play.api.mvc.{Action, BodyParser, Request, Result}
import play.filters.csrf.{CSRFAddToken, CSRFCheck, CSRFConfig}
import scala.concurrent.{ExecutionContext, Future}

class CSRFAction[A](underlying: Action[A], config: CSRFConfig, addToken: CSRFAddToken, checkToken: CSRFCheck)
    extends Action[A] {

  private val wrapped = addToken(underlying)
  private val wrappedWithCheck = checkToken(wrapped)

  def parser: BodyParser[A] = underlying.parser

  def executionContext: ExecutionContext = underlying.executionContext

  def apply(request: Request[A]): Future[Result] = {
    if (config.checkMethod(request.method)) {
      wrappedWithCheck(request)
    } else {
      wrapped(request)
    }
  }
}
