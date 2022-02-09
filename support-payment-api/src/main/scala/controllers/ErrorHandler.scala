package controllers

import com.typesafe.scalalogging.StrictLogging
import io.circe.Encoder
import model.ResultBody
import play.api._
import play.api.http.{DefaultHttpErrorHandler, MimeTypes, Writeable}
import play.api.mvc.Results._
import play.api.mvc._
import play.api.routing.Router
import play.core.SourceMapper
import scala.concurrent._

class ErrorHandler(
    env: play.api.Environment,
    config: Configuration,
    sourceMapper: Option[SourceMapper],
    router: Option[Router],
) extends DefaultHttpErrorHandler(env, config, sourceMapper, router)
    with StrictLogging {

  import JsonWriteableOps._

  protected implicit def jsonWriteable[A: Encoder]: Writeable[A] =
    Writeable(_.asByteString, Some(MimeTypes.JSON))

  // -- play is sending empty message for most of their errors
  def fillInEmptyMessage(message: String, result: Results.Status): Future[Result] = {
    if (message.isEmpty) {
      val statusMessage: String = result match {
        case BadRequest => "BadRequest"
        case Forbidden => "Forbidden"
        case NotFound => "NotFound"
        case _ => "UnknownError"
      }
      Future.successful(result(ResultBody.Error(statusMessage)))
    } else Future.successful(result(ResultBody.Error(message)))
  }

  override protected def onBadRequest(request: RequestHeader, message: String = "BadRequest"): Future[Result] =
    fillInEmptyMessage(message, BadRequest)

  override protected def onForbidden(request: RequestHeader, message: String = "Forbidden"): Future[Result] =
    fillInEmptyMessage(message, Forbidden)

  override def onNotFound(request: RequestHeader, message: String = "NotFound"): Future[Result] =
    fillInEmptyMessage(message, NotFound)

  override def onOtherClientError(
      request: RequestHeader,
      statusCode: Int,
      message: String = "UnknownError",
  ): Future[Result] =
    fillInEmptyMessage(message, InternalServerError)

  override def onServerError(request: RequestHeader, exception: Throwable): Future[Result] = {
    logger.error(
      s"Internal server error, for request: ${request.id}, method: ${request.method}, path: ${request.path}",
      exception,
    )
    fillInEmptyMessage(exception.getMessage, InternalServerError)
  }
}
