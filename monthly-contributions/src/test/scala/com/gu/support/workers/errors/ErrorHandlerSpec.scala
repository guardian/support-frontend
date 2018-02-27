package com.gu.support.workers.errors

import java.net.{SocketException, SocketTimeoutException}
import com.amazonaws.services.kms.model._
import com.gu.paypal.PayPalError
import com.gu.salesforce.Salesforce.SalesforceErrorResponse
import com.gu.salesforce.Salesforce.SalesforceErrorResponse._
import com.gu.stripe.Stripe
import com.gu.support.workers.exceptions.RetryImplicits._
import com.gu.support.workers.exceptions._
import com.gu.zuora.model.response.{ZuoraError, ZuoraErrorResponse}
import io.circe.ParsingFailure
import org.scalatest.{FlatSpec, Matchers}

class ErrorHandlerSpec extends FlatSpec with Matchers {
  "ErrorHandler" should "throw an RetryLimited when it handles an unknown error" in {
    an[RetryLimited] should be thrownBy {
      ErrorHandler.handleException(new ArithmeticException())
    }
  }

  "ErrorHandler" should "throw an RetryUnlimited when it handles a timeout" in {
    an[RetryUnlimited] should be thrownBy {
      ErrorHandler.handleException(new SocketTimeoutException())
    }
  }

  "ErrorHandler" should "throw an RetryUnlimited when the connection is reset" in {
    an[RetryUnlimited] should be thrownBy {
      ErrorHandler.handleException(new SocketException())
    }
  }

  "ErrorHandler" should "throw an RetryUnlimited when it handles a Salesforce expired auth token" in {
    an[RetryUnlimited] should be thrownBy {
      ErrorHandler.handleException(new SalesforceErrorResponse("test", expiredAuthenticationCode))
    }
  }

  "ErrorHandler" should "throw an RetryNone when it handles any other Salesforce error" in {
    an[RetryNone] should be thrownBy {
      ErrorHandler.handleException(new SalesforceErrorResponse("test", "test"))
    }
  }

  "asRetryException method" should "allow us to work out retries" in {
    //General
    new SocketTimeoutException().asRetryException shouldBe a[RetryUnlimited]
    new ParsingFailure("Invalid Json", new Throwable()).asRetryException shouldBe a[RetryNone]

    //Salesforce
    new SalesforceErrorResponse("test", expiredAuthenticationCode).asRetryException shouldBe a[RetryUnlimited]
    new SalesforceErrorResponse("test", rateLimitExceeded).asRetryException shouldBe a[RetryUnlimited]
    new SalesforceErrorResponse("", "").asRetryException shouldBe a[RetryNone]

    //Stripe
    new Stripe.StripeError("card_error", "").asRetryException shouldBe a[RetryNone]
    new Stripe.StripeError("invalid_request_error", "").asRetryException shouldBe a[RetryNone]
    new Stripe.StripeError("api_error", "").asRetryException shouldBe a[RetryUnlimited]
    new Stripe.StripeError("rate_limit_error", "").asRetryException shouldBe a[RetryUnlimited]

    //PayPal
    PayPalError(500, "").asRetryException shouldBe a[RetryUnlimited]
    PayPalError(400, "").asRetryException shouldBe a[RetryNone]

    //AWS KMS
    new KMSInvalidStateException("").asRetryException shouldBe a[RetryUnlimited]
    new InvalidGrantTokenException("").asRetryException shouldBe a[RetryNone]
    new DisabledException("").asRetryException shouldBe a[RetryLimited]
    new AWSKMSException("The security token included in the request is expired").asRetryException shouldBe a[RetryLimited]

    //Zuora
    ZuoraErrorResponse(false, List(ZuoraError("API_DISABLED", "tbc"))).asRetryException shouldBe a[RetryUnlimited]
    ZuoraErrorResponse(false, List(ZuoraError("LOCK_COMPETITION", "tbc"))).asRetryException shouldBe a[RetryUnlimited]
    ZuoraErrorResponse(false, List(ZuoraError("REQUEST_EXCEEDED_LIMIT", "tbc"))).asRetryException shouldBe a[RetryUnlimited]
    ZuoraErrorResponse(false, List(ZuoraError("REQUEST_EXCEEDED_RATE", "tbc"))).asRetryException shouldBe a[RetryUnlimited]
    ZuoraErrorResponse(false, List(ZuoraError("SERVER_UNAVAILABLE", "tbc"))).asRetryException shouldBe a[RetryUnlimited]
    ZuoraErrorResponse(false, List(ZuoraError("UNKNOWN_ERROR", "Operation failed due to an unknown error."))).asRetryException shouldBe a[RetryUnlimited]
    ZuoraErrorResponse(false, List(ZuoraError("TRANSACTION_FAILED", "Your card was declined"))).asRetryException shouldBe a[RetryNone]

  }
}
