package com.gu.helpers

import com.gu.monitoring.SafeLogger
import dispatch.Defaults.timer
import dispatch.{retry, _}

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Failure

object Retry {
  def apply[A](count: Int, errMsg: String = "Error despite retrying: ")(request: => Future[A])(implicit ec: ExecutionContext): Future[A] =
    retry.Backoff(max = count, delay = 2.seconds, base = 2) { () =>
      request.either
    } flatMap (_.fold(Future.failed, Future.successful)) andThen { case Failure(e) => SafeLogger.warn(errMsg, e) }
}