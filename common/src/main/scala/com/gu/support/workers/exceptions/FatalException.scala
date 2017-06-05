package com.gu.support.workers.exceptions

class FatalException(message: String = "", cause: Throwable = None.orNull)
  extends Exception(message, cause)