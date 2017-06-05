package com.gu.support.workers.exceptions

class UnknownException(cause: Throwable = None.orNull) extends NonFatalException("Unknown exception", cause)
