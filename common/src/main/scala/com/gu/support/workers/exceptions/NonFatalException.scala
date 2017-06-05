package com.gu.support.workers.exceptions

class NonFatalException(message: String = "", cause: Throwable = None.orNull)
  extends Exception(message, cause)
