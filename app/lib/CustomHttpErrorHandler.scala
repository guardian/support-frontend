package lib

import actions.CacheControl
import com.typesafe.scalalogging.LazyLogging
import monitoring.SentryLogging
import play.api.PlayException.ExceptionSource
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
)(implicit val ec: ExecutionContext) extends DefaultHttpErrorHandler(env, config, sourceMapper, router) with LazyLogging {

  override def onClientError(request: RequestHeader, statusCode: Int, message: String = ""): Future[Result] =
    super.onClientError(request, statusCode, message).map(_.withHeaders(CacheControl.defaultCacheHeaders(30.seconds, 30.seconds): _*))

  override protected def onNotFound(request: RequestHeader, message: String): Future[Result] =
    super.onNotFound(request, message).map(_.withHeaders(CacheControl.defaultCacheHeaders(30.seconds, 30.seconds): _*))

  override protected def onProdServerError(request: RequestHeader, exception: UsefulException): Future[Result] =
    super.onProdServerError(request, exception).map(_.withHeaders(CacheControl.noCache))

  override protected def onBadRequest(request: RequestHeader, message: String): Future[Result] =
    super.onBadRequest(request, message).map(_.withHeaders(CacheControl.noCache))

  override protected def logServerError(request: RequestHeader, usefulException: UsefulException): Unit = {
    val lineInfo = usefulException match {
      case source: ExceptionSource => s"${source.sourceName()} at line ${source.line()}"
      case _ => "unknown line number, please check the logs"
    }
    val sanitizedExceptionDetails = s"Caused by: ${usefulException.cause} in $lineInfo"
    val requestDetails = s"(${request.method}) [${request.path}]" // Use path, not uri, as query strings often contain things like ?api=key=my_secret
    logger.error(SentryLogging.noPii, s"Internal server error, for $requestDetails. $sanitizedExceptionDetails")

    super.logServerError(request, usefulException) // We still want the full uri and stack trace in our logs, just not in Sentry
  }

}
