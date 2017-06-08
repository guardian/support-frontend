package com.gu.helpers

import com.typesafe.scalalogging.LazyLogging
import dispatch.Defaults.timer
import dispatch.{retry, _}

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.util.Failure

object Retry extends LazyLogging {
  def apply[A](count: Int, errMsg: String = "Error despite retrying: ")(request: => Future[A])(implicit ec: ExecutionContext): Future[A] =
    retry.Backoff(max = count, delay = 2.seconds, base = 2) { () =>
      request.either
    } flatMap (_.fold(Future.failed, Future.successful)) andThen { case Failure(e) => logger.warn(errMsg, e) }
}