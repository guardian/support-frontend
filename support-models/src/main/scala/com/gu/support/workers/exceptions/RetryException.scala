package com.gu.support.workers.exceptions

sealed trait RetryException extends Throwable

class RetryNone(message: String, cause: Throwable = None.orNull) extends Throwable(message, cause) with RetryException

class RetryLimited(message: String, cause: Throwable = None.orNull)
    extends Throwable(message, cause)
    with RetryException

class RetryUnlimited(message: String, cause: Throwable = None.orNull)
    extends Throwable(message, cause)
    with RetryException
