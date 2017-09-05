package services

import cats.data.EitherT
import ophan.thrift.event.Acquisition
import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.Uri.Query
import akka.http.scaladsl.model._
import akka.http.scaladsl.model.headers.{Cookie, HttpCookiePair}
import akka.stream.ActorMaterializer

import scala.concurrent.{ExecutionContext, Future}

sealed trait OphanServiceError extends Throwable

object OphanServiceError {

  case class ResponseUnsuccessful(failedResponse: HttpResponse) extends OphanServiceError

  case class Generic(underlying: Throwable) extends OphanServiceError
}

object OphanService {

  private val endpoint = Uri.parseAbsolute("https://ophan.theguardian.com/a.gif")

  private def buildRequest(acquisition: Acquisition, browserId: String, viewId: String, visitId: Option[String]): HttpRequest = {
    import instances.acquisition._
    import io.circe.syntax._
    import scala.collection.immutable.Seq

    val params = Query("viewId" -> viewId, "acquisition" -> acquisition.asJson.noSpaces)

    val cookies: Seq[HttpCookiePair] = Seq("bwid" -> Some(browserId), "vsid" -> visitId)
      .collect { case (name, Some(value)) => HttpCookiePair(name, value) }

    HttpRequest(
      uri = endpoint.withQuery(params),
      headers = Seq(Cookie(cookies))
    )
  }

  private def executeRequest(
    request: HttpRequest
  )(implicit ec: ExecutionContext, system: ActorSystem, materializer: ActorMaterializer): EitherT[Future, OphanServiceError, HttpResponse] = {
    import cats.instances.future._
    import cats.syntax.applicativeError._
    import cats.syntax.either._

    Http().singleRequest(request).attemptT
      .leftMap(OphanServiceError.Generic)
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
  )(implicit ec: ExecutionContext, system: ActorSystem, materializer: ActorMaterializer): EitherT[Future, OphanServiceError, HttpResponse] = {
    val request = buildRequest(acquisition, browserId, viewId, visitId)
    executeRequest(request)
  }
}
