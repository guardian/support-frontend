package com.gu.acquisition.services

import cats.data.EitherT
import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.Uri.Query
import akka.http.scaladsl.model._
import akka.http.scaladsl.model.headers.{Cookie, HttpCookiePair}
import akka.stream.Materializer
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.OphanServiceError
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder

import scala.collection.immutable.Seq
import scala.concurrent.{ExecutionContext, Future}

/**
  * Build an acquisition submission, and submit it to the Ophan endpoint specified in the class constructor.
  * Uses Akka Http for executing the Http request.
  */
class DefaultOphanService(val endpoint: Uri)(implicit system: ActorSystem, materializer: Materializer)
  extends OphanService {
  import DefaultOphanService._
  import OphanServiceError._

  private val additionalEndpoint = endpoint.copy(path = Uri.Path("/a.gif"))

  private def buildRequest(submission: AcquisitionSubmission): RequestData = {
    import com.gu.acquisition.instances.acquisition._
    import io.circe.syntax._
    import submission._

    val params = Query("viewId" -> ophanIds.pageviewId, "acquisition" -> acquisition.asJson.noSpaces)

    val cookies = List(
      ophanIds.browserId.map(HttpCookiePair("bwid", _)),
      ophanIds.visitId.map(HttpCookiePair("vsid", _))
    ).flatten

    RequestData(
      HttpRequest(
        uri = additionalEndpoint.withQuery(params),
        headers = Seq(Cookie(cookies))
      ),
      submission
    )
  }

  private def executeRequest(data: RequestData)(
    implicit ec: ExecutionContext): EitherT[Future, OphanServiceError, AcquisitionSubmission] = {

    import cats.instances.future._
    import cats.syntax.applicativeError._

    Http().singleRequest(data.request).attemptT
      .leftMap(NetworkFailure)
      .subflatMap { response =>
        if (response.status.isSuccess) Right(data.submission)
        else Left(ResponseUnsuccessful(response))
      }
  }

  override def submit[A : AcquisitionSubmissionBuilder](a: A)(
    implicit ec: ExecutionContext): EitherT[Future, OphanServiceError, AcquisitionSubmission] = {

    import cats.instances.future._
    import cats.syntax.either._
    import AcquisitionSubmissionBuilder.ops._

    a.asAcquisitionSubmission.toEitherT.map(buildRequest).flatMap(executeRequest)
  }
}

object DefaultOphanService {

  private case class RequestData(request: HttpRequest, submission: AcquisitionSubmission)
}

