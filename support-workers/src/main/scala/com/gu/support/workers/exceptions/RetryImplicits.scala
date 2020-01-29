package com.gu.support.workers.exceptions

import java.net.{SocketException, SocketTimeoutException}

import com.amazonaws.services.sqs.model.{AmazonSQSException, InvalidMessageContentsException, QueueDoesNotExistException}
import com.gu.acquisition.model.errors.AnalyticsServiceError
import io.circe.{DecodingFailure, ParsingFailure}
import io.circe.syntax._
import com.gu.rest.{WebServiceClientError, WebServiceHelperError}
import com.gu.stripe.StripeError

object RetryImplicits {

  implicit class RetryConversions(val throwable: Throwable) extends AnyVal {
    def asRetryException: RetryException = throwable match {
      case wshe: WebServiceHelperError[_] if wshe.cause.isInstanceOf[DecodingFailure] =>
        // if we fail to parse SalesForce response or any JSON response, it means something failed
        // or we had malformed input, so we should not retry again.
        new RetryNone(message = wshe.getMessage, cause = wshe.cause)

      //Timeouts/connection issues and 500s
      case e @ (_: SocketTimeoutException | _: SocketException | _: WebServiceHelperError[_]) =>
        new RetryUnlimited(message = e.getMessage, cause = throwable)

      //WebServiceClientError
      case e @ (_: WebServiceClientError) if e.codeBody.code == "401" =>
        // We are retrying on 401s now because we have been receiving this
        // response from Zuora during maintenance windows
        new RetryLimited(message = e.getMessage, cause = throwable)

      case e @ (_: WebServiceClientError) =>
        new RetryNone(message = e.getMessage, cause = throwable)

      //Invalid Json
      case e @ (_: ParsingFailure | _: MatchError) =>
        new RetryNone(message = e.getMessage, cause = throwable)

      //Any Exception that we haven't specifically handled
      case e: Throwable => new RetryLimited(message = e.getMessage, cause = throwable)
    }
  }

  implicit class StripeConversions(val throwable: StripeError) extends AnyVal {
    def asRetryException: RetryException = throwable.`type` match {
      case "api_connection_error" | "api_error" | "rate_limit_error" => new RetryUnlimited(throwable.asJson.noSpaces, cause = throwable)
      case "authentication_error" => new RetryLimited(throwable.asJson.noSpaces, cause = throwable)
      case "card_error" | "invalid_request_error" | "validation_error" => new RetryNone(throwable.asJson.noSpaces, cause = throwable)
    }
  }

  implicit class AwsSQSConversions(val throwable: AmazonSQSException) extends AnyVal {
    def asRetryException: RetryException = throwable match {
      case e: InvalidMessageContentsException => new RetryNone(message = e.getMessage, cause = throwable)
      case e: QueueDoesNotExistException => new RetryLimited(message = e.getMessage, cause = throwable)
    }
  }

  implicit class ZuoraCatalogConversions(val throwable: CatalogDataNotFoundException) extends AnyVal {
    def asRetryException: RetryException = new RetryNone(message = throwable.getMessage, cause = throwable)
  }

  implicit class BadRequestConversions(val throwable: BadRequestException) extends AnyVal {
    def asRetryException: RetryException = new RetryNone(message = throwable.getMessage, cause = throwable)
  }

  implicit class OphanServiceErrorConversions(val error: AnalyticsServiceError) extends AnyVal {
    import AnalyticsServiceError._

    def asRetryException: RetryException =
      error match {
        case BuildError(message) => new RetryNone(message)
        case _: NetworkFailure => new RetryUnlimited(error.getMessage, error)
        case _: ResponseUnsuccessful => new RetryLimited(error.getMessage, error)
        case kinesisError: KinesisError => new RetryNone(kinesisError.getMessage)
      }
  }
}
