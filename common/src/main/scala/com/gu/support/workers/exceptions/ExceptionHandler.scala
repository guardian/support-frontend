package com.gu.support.workers.exceptions

import java.net.SocketTimeoutException

import com.amazonaws.services.kms.model._
import com.gu.helpers.WebServiceHelperError
import com.gu.stripe.Stripe
import io.circe.ParsingFailure

object ExceptionHandler {
  val handleException: PartialFunction[Throwable, Any] = {
    //Timeouts & 500s
    case e@(_: SocketTimeoutException |
            _: WebServiceHelperError[_]) => nonFatal(e)
    //Invalid Json
    case e@(_: ParsingFailure) => fatal(e)
    //Stripe
    case e: Stripe.Error => handleStripeException(e)
    //AWS encryption SDK
    case e: AWSKMSException => handleKmsException(e)
    //Any Exception that we haven't specifically handled
    case e: Exception => throw new UnknownException(e)
  }

  private def handleStripeException(e: Stripe.Error) = e.`type` match {
    case "api_connection_error" => nonFatal(e)
    case "api_error" => nonFatal(e)
    case "authentication_error" => nonFatal(e)
    case "card_error" => fatal(e) //Can we just throw the Stripe error here?
    case "invalid_request_error" => fatal(e)
    case "rate_limit_error" => nonFatal(e)
  }

  private def handleKmsException(e: AWSKMSException) = e match {
    case _@(_: NotFoundException |
            _: DisabledException |
            _: KeyUnavailableException |
            _: DependencyTimeoutException |
            _: KMSInternalException |
            _: KMSInvalidStateException) => nonFatal(e)
    case _@(_: InvalidKeyUsageException | _: InvalidGrantTokenException) => fatal(e)
  }

  private def fatal(e: Throwable) = throw new FatalException("Fatal Exception", e)

  private def nonFatal(e: Throwable) = throw new NonFatalException("NonFatal Exception", e)

}
