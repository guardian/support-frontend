package lib

import lib.httpheaders.CacheControl
import play.api.{Configuration, Environment, UsefulException}
import play.api.http.DefaultHttpErrorHandler
import play.api.routing.Router
import play.api.mvc.{RequestHeader, Result}
import play.core.SourceMapper

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._

class CustomHttpErrorHandler(
  env: Environment,
  config: Configuration,
  sourceMapper: Option[SourceMapper],
  router: => Option[Router]
)(implicit val ec: ExecutionContext) extends DefaultHttpErrorHandler(env, config, sourceMapper, router) {

  override def onClientError(request: RequestHeader, statusCode: Int, message: String = ""): Future[Result] =
    super.onClientError(request, statusCode, message).map(_.withHeaders(CacheControl.defaultCacheHeaders(30.seconds, 30.seconds): _*))

  override protected def onNotFound(request: RequestHeader, message: String): Future[Result] =
    super.onNotFound(request, message).map(_.withHeaders(CacheControl.defaultCacheHeaders(30.seconds, 30.seconds): _*))

  override protected def onProdServerError(request: RequestHeader, exception: UsefulException): Future[Result] =
    super.onProdServerError(request, exception).map(_.withHeaders(CacheControl.noCache))

  override protected def onBadRequest(request: RequestHeader, message: String): Future[Result] =
    super.onBadRequest(request, message).map(_.withHeaders(CacheControl.noCache))
}
