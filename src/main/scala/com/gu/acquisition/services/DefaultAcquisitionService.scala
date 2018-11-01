package com.gu.acquisition.services

import cats.data.EitherT
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import okhttp3.{HttpUrl, OkHttpClient}

import scala.concurrent.ExecutionContext

class DefaultAcquisitionService(ophanEndpoint: Option[HttpUrl] = None)(implicit client: OkHttpClient) extends AcquisitionService {
  private val ophanService = new OphanService(ophanEndpoint)
  private val gAService = new GAService()
  override def submit[A: AcquisitionSubmissionBuilder](a: A)(implicit ec: ExecutionContext) = {
    val ov = ophanService.submit(a).value
    val gv = gAService.submit(a).value
    val result = for {
      o <- ov
      g <- gv
    } yield mergeEithers(o, g)
    EitherT(result)
  }

  // Take 2 Eithers of type Either[AnalyticsServiceError, AcquisitionSubmission] and return Right(AcquisitionSubmission) if they both succeed
  // or a Left(List[AnalyticsServiceError]) if one or both submissions fail.
  def mergeEithers(e1: Either[AnalyticsServiceError, AcquisitionSubmission], e2: Either[AnalyticsServiceError, AcquisitionSubmission]): Either[List[AnalyticsServiceError], AcquisitionSubmission] = {
    val errors = e1.swap.toSeq ++ e2.swap.toSeq
    val submission = e1.toSeq ++ e2.toSeq
    if (errors == Nil) {
      Right(submission.head)
    } else {
      Left(errors.toList)
    }
  }
}
