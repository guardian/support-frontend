package com.gu.support.workers.exceptions

class BadRequestException(message: String = "", cause: Throwable = None.orNull) extends Throwable(message, cause)
