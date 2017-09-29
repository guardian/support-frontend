package com.gu.acquisition.services
import cats.data.EitherT
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.OphanServiceError
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder

import scala.concurrent.{ExecutionContext, Future}

/**
  * Build an acquisition submission, but don't actually send it to an Ophan endpoint.
  * Useful for e.g. test users.
  */
object MockOphanService extends OphanService {

  override def submit[A: AcquisitionSubmissionBuilder](a: A)(
    implicit ec: ExecutionContext): EitherT[Future, OphanServiceError, AcquisitionSubmission] = {

    import cats.instances.future._
    import cats.syntax.either._
    import AcquisitionSubmissionBuilder.ops._

    // Left map to lift the build error into a processing error.
    a.asAcquisitionSubmission.toEitherT.leftMap(err => err: OphanServiceError)
  }
}
