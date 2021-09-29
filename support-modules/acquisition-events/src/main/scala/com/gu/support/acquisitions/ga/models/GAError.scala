package com.gu.support.acquisitions.ga.models

import java.io.IOException

import okhttp3.{Request, Response}

sealed trait GAError extends Throwable

object GAError {

  case class BuildError(message: String) extends GAError {
    override def getMessage: String = s"Acquisition submission build error: $message"
  }

  case class NetworkFailure(underlying: IOException) extends GAError {
    override def getMessage: String = s"Analytics network failure: ${underlying.getMessage}"
  }

  case class ResponseUnsuccessful(request: Request, failedResponse: Response) extends GAError {
    override def getMessage: String = {
      s"HTTP request failed: ${failedResponse.code}"
    }
  }
}
