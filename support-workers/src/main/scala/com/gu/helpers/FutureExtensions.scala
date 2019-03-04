package com.gu.helpers

import scala.concurrent.{ExecutionContext, Future}

object FutureExtensions {
  implicit class EnrichedFuture[T](underlying: Future[T]) {
    def whenFinished[U](fn: => U)(implicit ec: ExecutionContext): Future[U] =
      underlying.recover({ case _ => () }).map(_ => fn)
  }
}
