package com.gu.support.workers.exceptions

import java.net.SocketTimeoutException

import com.amazonaws.services.kms.model._
import com.gu.helpers.WebServiceHelperError
import io.circe.ParsingFailure

object RetryImplicits {

  implicit class RetryConversions(val throwable: Throwable) {
    def asRetryException: RetryException = throwable match {
      //timeouts and 500s
      case _: SocketTimeoutException |
           _: WebServiceHelperError[_] => new RetryUnlimited(cause = throwable)

      //Invalid Json
      case _: ParsingFailure => new RetryNone(cause = throwable)

      //Any Exception that we haven't specifically handled
      case _: Throwable => new RetryLimited(cause = throwable)
    }
  }

  implicit class AwsKmsConversions(val throwable: AWSKMSException) {
    def asRetryException: RetryException = throwable match {
      case _: KeyUnavailableException |
           _: DependencyTimeoutException |
           _: KMSInternalException |
           _: KMSInvalidStateException => new RetryUnlimited(cause = throwable)
      case _: InvalidGrantTokenException => new RetryNone(cause = throwable)
      case _: NotFoundException |
           _: DisabledException |
           _: InvalidKeyUsageException |
           _ => new RetryLimited(cause = throwable)
    }
  }
}
