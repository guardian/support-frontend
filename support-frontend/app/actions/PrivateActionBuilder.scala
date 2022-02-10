package actions

import play.api.mvc.{Action, ActionBuilder, AnyContent, BodyParser, Request, Result}
import play.filters.csrf.{CSRFAddToken, CSRFCheck, CSRFConfig}

import scala.concurrent.{ExecutionContext, Future}

class PrivateActionBuilder(
    addToken: CSRFAddToken,
    checkToken: CSRFCheck,
    csrfConfig: CSRFConfig,
    val parser: BodyParser[AnyContent],
    val executionContext: ExecutionContext,
) extends ActionBuilder[Request, AnyContent] {

  private implicit val ec = executionContext

  override def composeAction[A](action: Action[A]): Action[A] =
    new CSRFAction(action, csrfConfig, addToken, checkToken)

  override def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]): Future[Result] =
    block(request).map(_.withHeaders(CacheControl.noCache))
}
