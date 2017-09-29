package com.gu.acquisition.typeclasses

import com.gu.acquisition.model.errors.OphanServiceError.BuildError
import com.gu.acquisition.model.{AcquisitionSubmission, OphanIds}
import ophan.thrift.event.Acquisition
import simulacrum.typeclass

/**
  * Type class for creating an acquisition submission from an arbitrary data type.
  */
@typeclass trait AcquisitionSubmissionBuilder[A] {

  import cats.syntax.either._

  def buildOphanIds(a: A): Either[String, OphanIds]

  def buildAcquisition(a: A): Either[String, Acquisition]

  def asAcquisitionSubmission(a: A): Either[BuildError, AcquisitionSubmission] =
    (for {
      ophanIds <- buildOphanIds(a)
      acquisition <- buildAcquisition(a)
    } yield AcquisitionSubmission(ophanIds, acquisition)).leftMap(BuildError)
}