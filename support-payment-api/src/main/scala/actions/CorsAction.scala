package actions

import play.api.http.HeaderNames
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

class CorsAction(
    val parser: BodyParser[AnyContent],
    val executionContext: ExecutionContext,
    corsUrls: List[String],
) extends ActionBuilder[Request, AnyContent] {

  implicit def ec: ExecutionContext = executionContext

  private def corsHeaders(request: Request[_]) = {
    val origin = request.headers.get(HeaderNames.ORIGIN)
    origin.filter(corsUrls.contains).toList.flatMap { origin =>
      List(
        "Access-Control-Allow-Origin" -> origin,
        "Access-Control-Allow-Headers" -> "Origin, Content-Type, Accept",
        "Access-Control-Allow-Credentials" -> "true",
      )
    }
  }

  override def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]): Future[Result] =
    block(request).map(_.withHeaders(corsHeaders(request): _*))

}

trait CorsActionProvider {

  implicit val controllerComponents: ControllerComponents
  implicit val corsUrls: List[String]

  lazy val CorsAction: CorsAction = new CorsAction(
    controllerComponents.parsers.defaultBodyParser,
    controllerComponents.executionContext,
    corsUrls,
  )
}
