package com.gu.support.workers.exceptions

case class NonFatalException(message: String = "", cause: Throwable = None.orNull)
  extends Exception(message, cause)
