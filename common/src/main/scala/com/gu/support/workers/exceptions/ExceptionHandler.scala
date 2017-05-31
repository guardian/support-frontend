package com.gu.support.workers.exceptions

import java.net.SocketTimeoutException

import com.gu.helpers.WebServiceHelperError

object ExceptionHandler {
  val handleException: PartialFunction[Throwable, Any] = {
    case e@(_: SocketTimeoutException | _: WebServiceHelperError[_]) => throw NonFatalException("Top level exception", e)
  }
}
