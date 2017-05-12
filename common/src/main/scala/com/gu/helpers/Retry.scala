package com.gu.helpers

import scala.concurrent.{ ExecutionContext, Future }
import scala.util.Failure
import scala.concurrent.duration._
import dispatch._
import Defaults.timer
import com.typesafe.scalalogging.LazyLogging
import dispatch.retry

object Retry extends LazyLogging {
  def apply[A](count: Int, errMsg: String = "Error despite retrying: ")(request: => Future[A])(implicit ec: ExecutionContext): Future[A] =
    retry.Backoff(max = count, delay = 2.seconds, base = 2) { () =>
      request.either
    } flatMap (_.fold(Future.failed, Future.successful)) andThen { case Failure(e) => logger.error(errMsg, e) }
}