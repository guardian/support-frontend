package com.gu.acquisition
package services

import cats.data.EitherT
import ophan.thrift.event.Acquisition
import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.Uri.Query
import akka.http.scaladsl.model._
import akka.http.scaladsl.model.headers.{Cookie, HttpCookiePair}
import akka.stream.Materializer

import scala.concurrent.{ExecutionContext, Future}

sealed trait OphanServiceError extends Throwable

object OphanServiceError {

  case class ResponseUnsuccessful(failedResponse: HttpResponse) extends OphanServiceError {
    override def getMessage: String = s"Ophan HTTP request failed: ${failedResponse.status}"
  }

  case class NetworkFailure(underlying: Throwable) extends OphanServiceError {
    override def getMessage: String = underlying.getMessage
  }

}

class OphanService(endpoint: Uri)(implicit system: ActorSystem, materializer: Materializer) {

  private val additionalEndpoint = endpoint.copy(path = Uri.Path("/a.gif"))

  private def buildRequest(acquisition: Acquisition, browserId: String, viewId: String, visitId: Option[String]): HttpRequest = {
    import instances.acquisition._
    import io.circe.syntax._
    import scala.collection.immutable.Seq

    val params = Query("viewId" -> viewId, "acquisition" -> acquisition.asJson.noSpaces)

    val cookies: Seq[HttpCookiePair] = Seq("bwid" -> Some(browserId), "vsid" -> visitId)
      .collect { case (name, Some(value)) => HttpCookiePair(name, value) }

    HttpRequest(
      uri = additionalEndpoint.withQuery(params),
      headers = Seq(Cookie(cookies))
    )
  }

  private def executeRequest(
    request: HttpRequest
  )(implicit ec: ExecutionContext): EitherT[Future, OphanServiceError, HttpResponse] = {
    import cats.instances.future._
    import cats.syntax.applicativeError._
    import cats.syntax.either._

    Http().singleRequest(request).attemptT
      .leftMap(OphanServiceError.NetworkFailure)
      .subflatMap { res =>
        if (res.status.isSuccess) Either.right(res)
        else Either.left(OphanServiceError.ResponseUnsuccessful(res))
      }
  }

  def submit(
      acquisition: Acquisition,
      browserId: String,
      viewId: String,
      visitId: Option[String]
  )(implicit ec: ExecutionContext): EitherT[Future, OphanServiceError, HttpResponse] = {
    val request = buildRequest(acquisition, browserId, viewId, visitId)
    executeRequest(request)
  }
}

object OphanService {

  def prod(implicit system: ActorSystem, materializer: Materializer): OphanService =
    new OphanService(Uri.parseAbsolute("https://ophan.theguardian.com"))
}
