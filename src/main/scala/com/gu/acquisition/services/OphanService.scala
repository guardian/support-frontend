package com.gu.acquisition.services

import akka.actor.ActorSystem
import akka.http.scaladsl.model.Uri
import akka.stream.Materializer
import cats.data.EitherT
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.OphanServiceError
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder

import scala.concurrent.{ExecutionContext, Future}

/**
  * Service for sending acquisition events to Ophan.
  */
trait OphanService {

  def submit[A : AcquisitionSubmissionBuilder](a: A)(
    implicit ec: ExecutionContext): EitherT[Future, OphanServiceError, AcquisitionSubmission]
}

object OphanService {

  val prodEndpoint: Uri = "https://ophan.theguardian.com"

  def prod(implicit system: ActorSystem, materializer: Materializer): DefaultOphanService =
    new DefaultOphanService(prodEndpoint)

  def apply(endpoint: Uri)(implicit system: ActorSystem, materializer: Materializer): DefaultOphanService =
    new DefaultOphanService(endpoint)
}