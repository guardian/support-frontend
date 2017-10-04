package com.gu.acquisition.services

import cats.data.EitherT
import com.gu.acquisition.model.AcquisitionSubmission
import com.gu.acquisition.model.errors.OphanServiceError
import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import okhttp3.{HttpUrl, OkHttpClient}

import scala.concurrent.{ExecutionContext, Future}

/**
  * Service for sending acquisition events to Ophan.
  */
trait OphanService {

  def submit[A : AcquisitionSubmissionBuilder](a: A)(
    implicit ec: ExecutionContext): EitherT[Future, OphanServiceError, AcquisitionSubmission]
}

object OphanService {

  val prodEndpoint: HttpUrl = HttpUrl.parse("https://ophan.theguardian.com")

  def prod(implicit client: OkHttpClient): DefaultOphanService =
    new DefaultOphanService(prodEndpoint)

  def apply(endpoint: HttpUrl)(implicit client: OkHttpClient): DefaultOphanService =
    new DefaultOphanService(endpoint)

  def apply(endpoint: String)(implicit client: OkHttpClient): Either[InvalidUrl, DefaultOphanService] = {
    val parsedEndpoint = HttpUrl.parse(endpoint)
    if (parsedEndpoint == null) Left(InvalidUrl(endpoint)) else Right(OphanService(parsedEndpoint))
  }

  case class InvalidUrl(url: String) extends Exception
}