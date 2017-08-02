package com.gu.support.workers.exceptions

import java.net.SocketTimeoutException

import com.amazonaws.services.kms.model._
import com.amazonaws.services.sqs.model.{AmazonSQSException, InvalidMessageContentsException, QueueDoesNotExistException}
import com.gu.helpers.WebServiceHelperError
import io.circe.ParsingFailure

object RetryImplicits {

  implicit class RetryConversions(val throwable: Throwable) {
    def asRetryException: RetryException = throwable match {
      //timeouts and 500s
      case e @ (_: SocketTimeoutException |
        _: WebServiceHelperError[_]) => new RetryUnlimited(message = e.getMessage, cause = throwable)

      //Invalid Json
      case e: ParsingFailure => new RetryNone(message = e.getMessage, cause = throwable)

      //Any Exception that we haven't specifically handled
      case e: Throwable => new RetryLimited(message = e.getMessage, cause = throwable)
    }
  }

  implicit class AwsKmsConversions(val throwable: AWSKMSException) {
    def asRetryException: RetryException = throwable match {
      case e @ (_: KeyUnavailableException |
        _: DependencyTimeoutException |
        _: KMSInternalException |
        _: KMSInvalidStateException) => new RetryUnlimited(message = e.getMessage, cause = throwable)
      case e: InvalidGrantTokenException => new RetryNone(message = e.getMessage, cause = throwable)
      case e @ (_: NotFoundException |
        _: DisabledException |
        _: InvalidKeyUsageException |
        _: Throwable) => new RetryLimited(message = e.getMessage, cause = throwable)
    }
  }

  implicit class AwsSQSConversions(val throwable: AmazonSQSException) {
    def asRetryException: RetryException = throwable match {
      case e: InvalidMessageContentsException => new RetryNone(message = e.getMessage, cause = throwable)
      case e: QueueDoesNotExistException => new RetryLimited(message = e.getMessage, cause = throwable)
    }
  }

}
