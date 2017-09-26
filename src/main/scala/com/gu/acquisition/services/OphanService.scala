package com.gu.acquisition.services

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

class OphanService(val endpoint: Uri)(implicit system: ActorSystem, materializer: Materializer) {
  import scala.collection.immutable.Seq
  import OphanService._

  private val additionalEndpoint = endpoint.copy(path = Uri.Path("/a.gif"))

  private def buildRequest(
      acquisition: Acquisition,
      viewId: String,
      browserId: Option[String],
      visitId: Option[String]
  ): HttpRequest = {
    import com.gu.acquisition.instances.acquisition._
    import io.circe.syntax._

    val params = Query("viewId" -> viewId, "acquisition" -> acquisition.asJson.noSpaces)

    val cookies = List(browserId.map(HttpCookiePair("bwid", _)), visitId.map(HttpCookiePair("vsid", _))).flatten

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

  /**
    * Submit an acquisition to Ophan.
    *
    * If browserId or viewId are missing, then it is not guaranteed they will be available
    * for the respective acquisition in the data lake table: acquisitions.
    * This will make certain reporting and analysis harder.
    * If possible they should be included.
    */
  def submit(
      acquisition: Acquisition,
      viewId: String,
      browserId: Option[String],
      visitId: Option[String]
  )(implicit ec: ExecutionContext): EitherT[Future, OphanServiceError, HttpResponse] = {
    val request = buildRequest(acquisition, viewId, browserId, visitId)
    executeRequest(request)
  }
}

object OphanService {

  val prodEndpoint: Uri = "https://ophan.theguardian.com"

  def prod(implicit system: ActorSystem, materializer: Materializer): OphanService =
    new OphanService(prodEndpoint)
}
