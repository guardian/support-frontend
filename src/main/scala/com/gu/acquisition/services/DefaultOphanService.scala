package com.gu.acquisition.services

import java.io.IOException

import cats.data.EitherT
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.OphanServiceError
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import okhttp3._

import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.util.control.NonFatal

/**
  * Build an acquisition submission, and submit it to the Ophan endpoint specified in the class constructor.
  * Uses OkHttp for executing the Http request.
  */
class DefaultOphanService(val endpoint: HttpUrl)(implicit client: OkHttpClient)
  extends OphanService {
  import DefaultOphanService._
  import OphanServiceError._

  private def cookieValue(visitId: Option[String], browserId: Option[String]): String =
    List(visitId.map(("vsid", _)), browserId.map(("bwid", _))).flatten
      .map { case (name, value) => name + "=" + value }
      .mkString(";")

  // Exposed for unit testing
  private[services] def buildRequest(submission: AcquisitionSubmission): RequestData = {
    import com.gu.acquisition.instances.acquisition._
    import io.circe.syntax._
    import submission._

    val url = endpoint.newBuilder()
      .addPathSegment("a.gif")
      .addQueryParameter("viewId", ophanIds.pageviewId)
      .addQueryParameter("acquisition" , acquisition.asJson.noSpaces)
      .build()

    val request = new Request.Builder()
      .url(url)
      .addHeader("Cookie", cookieValue(ophanIds.visitId, ophanIds.browserId))
      .build()

    RequestData(request, submission)
  }

  private def executeRequest(data: RequestData): EitherT[Future, OphanServiceError, AcquisitionSubmission] = {

    val p = Promise[Either[OphanServiceError, AcquisitionSubmission]]

    client.newCall(data.request).enqueue(new Callback {

      override def onFailure(call: Call, e: IOException): Unit =
        p.success(Left(NetworkFailure(e)))

      private def close(response: Response): Unit =
        try {
          response.close()
        } catch {
          case NonFatal(_) =>
        }

      override def onResponse(call: Call, response: Response): Unit =
        try {
          if (response.isSuccessful) p.success(Right(data.submission))
          else p.success(Left(ResponseUnsuccessful(data.request, response)))
        } finally {
          close(response)
        }
    })

    EitherT(p.future)
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

  private[services] case class RequestData(request: Request, submission: AcquisitionSubmission)
}

