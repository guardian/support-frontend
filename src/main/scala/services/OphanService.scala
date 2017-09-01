package services

import cats.data.EitherT
import com.netaporter.uri.Uri
import ophan.thrift.event.Acquisition

import scalaj.http._
import scala.concurrent.{ExecutionContext, Future}

sealed trait OphanServiceError extends Throwable

object OphanServiceError {

  case class ResponseUnsuccessful(code: Int, body: String) extends OphanServiceError

  case class Generic(underlying: Throwable) extends OphanServiceError
}

object OphanService {

  private val endpoint = Uri.parse("https://ophan.theguardian.com/a.gif")

  private def buildRequest(acquisition: Acquisition, browserId: String, viewId: String, visitId: Option[String]): HttpRequest = {
    import instances.acquisition._
    import io.circe.syntax._

    val cookies = Seq("bwid" -> Some(browserId), "vsid" -> visitId)
      .collect { case (k, Some(v)) => s"$k=$v" }
      .mkString(";")

    val params = Seq("viewId" -> viewId, "acquisition" -> acquisition.asJson.noSpaces)

    Http(endpoint.addParams(params).toString).header("Cookie", cookies)
  }

  private def executeRequest(request: HttpRequest)(implicit ec: ExecutionContext): EitherT[Future, OphanServiceError, HttpResponse[String]] = {
    import cats.instances.future._
    import cats.syntax.applicativeError._
    import cats.syntax.either._

    Future(request.asString).attemptT
      .leftMap(OphanServiceError.Generic)
      .subflatMap {
        case response if response.isSuccess => Either.right(response)
        case response => Either.left(OphanServiceError.ResponseUnsuccessful(response.code, response.body))
      }
  }

  def submit(
      acquisition: Acquisition,
      browserId: String,
      viewId: String,
      visitId: Option[String]
  )(implicit ec: ExecutionContext): EitherT[Future, OphanServiceError, HttpResponse[String]] = {
    val request = buildRequest(acquisition, browserId, viewId, visitId)
    executeRequest(request)
  }
}
