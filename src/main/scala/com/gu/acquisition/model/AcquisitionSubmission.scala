package com.gu.acquisition.model

import com.gu.acquisition.services.{AcquisitionSubmissionProcessor, BuildError, OphanServiceError, ProcessError}
import com.gu.acquisition.services.OphanServiceError.SubmissionBuildError
import ophan.thrift.event.Acquisition
import play.api.libs.json.{Reads, Writes, Json => PlayJson}
import simulacrum.typeclass

case class OphanIds(pageviewId: String, visitId: Option[String], browserId: Option[String])

object OphanIds {
  import io.circe._
  import io.circe.generic.semiauto._

  implicit val reads: Reads[OphanIds] = PlayJson.reads[OphanIds]
  implicit val writes: Writes[OphanIds] = PlayJson.writes[OphanIds]

  implicit val encoder: Encoder[OphanIds] = deriveEncoder[OphanIds]
  implicit val decoder: Decoder[OphanIds] = deriveDecoder[OphanIds]
}

/**
  * Encapsulates all the data required to submit an acquisition to Ophan.
  */
case class AcquisitionSubmission(ophanIds: OphanIds, acquisition: Acquisition)

object AcquisitionSubmission {

  implicit val defaultAcquisitionSubmissionBuilder: AcquisitionSubmissionBuilder[AcquisitionSubmission] =
    new AcquisitionSubmissionBuilder[AcquisitionSubmission] {
      import cats.syntax.either._

      override def buildOphanIds(a: AcquisitionSubmission): Either[String, OphanIds] =
        Either.right(a.ophanIds)

      override def buildAcquisition(a: AcquisitionSubmission): Either[String, Acquisition] =
        Either.right(a.acquisition)
    }
}

/**
  * Type class for creating an acquisition submission from an arbitrary data type.
  */
@typeclass trait AcquisitionSubmissionBuilder[A] {

  import cats.syntax.either._

  def buildOphanIds(a: A): Either[BuildError, OphanIds]

  def buildAcquisition(a: A): Either[BuildError, Acquisition]

  def asAcquisitionSubmission(a: A): Either[BuildError, AcquisitionSubmission] =
    (for {
      ophanIds <- buildOphanIds(a)
      acquisition <- buildAcquisition(a)
    } yield AcquisitionSubmission(ophanIds, acquisition))
}