package actions

import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

object MultiplexedActionBuilder {
  def apply(
    primary: ActionBuilder[Request, AnyContent],
    secondary: ActionBuilder[Request, AnyContent],
    usePrimary: Request[_] => Boolean
  )(implicit ec: ExecutionContext): MultiplexedActionBuilder =
    new MultiplexedActionBuilder(primary, secondary, usePrimary)(ec)
}

class MultiplexedActionBuilder(
  primaryActionBuilder: ActionBuilder[Request, AnyContent],
  secondaryActionBuilder: ActionBuilder[Request, AnyContent],
  usePrimary: Request[_] => Boolean
)(implicit val ec: ExecutionContext) {

  def async(primary: => Future[Result], secondary: => Future[Result]): Action[AnyContent] = {
    val primaryAction = primaryActionBuilder.async { primary }
    val secondaryAction = secondaryActionBuilder.async { secondary }
    new Action[AnyContent] {
      override def parser: BodyParser[AnyContent] = primaryActionBuilder.parser

      override def apply(request: Request[AnyContent]): Future[Result] =
        if (usePrimary(request)) {
          primaryAction(request)
        } else {
          secondaryAction(request)
        }

      override def executionContext: ExecutionContext = ec
    }
  }

  def apply[T](primary: => Result, secondary: => Result): Action[AnyContent] =
    async(Future.successful(primary), Future.successful(secondary))

}