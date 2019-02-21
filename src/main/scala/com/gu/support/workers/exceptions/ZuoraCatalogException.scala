package com.gu.support.workers.exceptions

class ZuoraCatalogException(message: String = "", cause: Throwable = None.orNull) extends Throwable(message, cause)

class CatalogDataNotFound(message: String = "", cause: Throwable = None.orNull) extends ZuoraCatalogException(message, cause)
