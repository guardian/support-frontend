package com.gu.acquisition.model.errors

import akka.http.scaladsl.model.HttpResponse

sealed trait OphanServiceError extends Throwable

object OphanServiceError {

  case class BuildError(message: String) extends OphanServiceError {
    override def getMessage: String = s"Acquisition submission build error: $message"
  }

  case class NetworkFailure(underlying: Throwable) extends OphanServiceError {
    override def getMessage: String = s"Ophan network failure: ${underlying.getMessage}"
  }

  case class ResponseUnsuccessful(failedResponse: HttpResponse) extends OphanServiceError {
    override def getMessage: String = s"Ophan HTTP request failed: ${failedResponse.status}"
  }
}

