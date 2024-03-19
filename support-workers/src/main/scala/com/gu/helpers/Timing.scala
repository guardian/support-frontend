package com.gu.helpers

import com.gu.monitoring.SafeLogging

import scala.concurrent.{ExecutionContext, Future}

object Timing extends SafeLogging {

  def record[T](service: String, metricName: String)(block: => Future[T])(implicit ec: ExecutionContext): Future[T] = {
    val fullName = s"$service $metricName"
    logger.debug(s"$fullName started...")
    val startTime = System.currentTimeMillis()

    def recordEnd[A](name: String)(a: A): A = {
      val duration = System.currentTimeMillis() - startTime
      logger.debug(s"$name completed in $duration ms")

      a
    }

    block.transform(recordEnd(fullName), recordEnd(s"$fullName failed"))
  }
}
