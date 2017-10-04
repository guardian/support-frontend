package com.gu.acquisition.model.errors

import java.io.IOException

import okhttp3.Response

sealed trait OphanServiceError extends Throwable

object OphanServiceError {

  case class BuildError(message: String) extends OphanServiceError {
    override def getMessage: String = s"Acquisition submission build error: $message"
  }

  case class NetworkFailure(underlying: IOException) extends OphanServiceError {
    override def getMessage: String = s"Ophan network failure: ${underlying.getMessage}"
  }

  case class ResponseUnsuccessful(failedResponse: Response) extends OphanServiceError {
    override def getMessage: String = s"Ophan HTTP request failed: ${failedResponse.code}"
  }
}

