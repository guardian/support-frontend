package com.gu.support.workers.errors

import java.net.SocketTimeoutException

import com.gu.salesforce.Salesforce.SalesforceErrorResponse
import com.gu.support.workers.exceptions.{ExceptionHandler, FatalException, NonFatalException, UnknownException}
import org.scalatest.{FlatSpec, Matchers}

class ErrorHandlerSpec extends FlatSpec with Matchers {
  "ErrorHandler" should "throw an UnknownException when it handles an unknown error" in {
    an[UnknownException] should be thrownBy {
      ExceptionHandler.handleException(new ArithmeticException())
    }
  }

  "ErrorHandler" should "throw an NonFatalException when it handles a timeout" in {
    an[NonFatalException] should be thrownBy {
      ExceptionHandler.handleException(new SocketTimeoutException())
    }
  }

  "ErrorHandler" should "throw an NonFatalException when it handles a Salesforce expired auth token" in {
    an[NonFatalException] should be thrownBy {
      ExceptionHandler.handleException(new SalesforceErrorResponse("test", SalesforceErrorResponse.expiredAuthenticationCode))
    }
  }

  "ErrorHandler" should "throw an FatalException when it handles any other Salesforce error" in {
    an[FatalException] should be thrownBy {
      ExceptionHandler.handleException(new SalesforceErrorResponse("test", "test"))
    }
  }
}
