package com.gu.support.workers.helpers

import com.gu.support.workers.monitoring.CloudWatch
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future


object Timing extends LazyLogging {

  def record[T](cloudWatch: CloudWatch, metricName: String)(block: => Future[T]): Future[T] = {
    logger.trace(s"$metricName started...")
    cloudWatch.put(metricName, 1)
    val startTime = System.currentTimeMillis()

    def recordEnd[A](name: String)(a: A): A = {
      val duration = System.currentTimeMillis() - startTime
      cloudWatch.put(name + " duration ms", duration)
      logger.debug(s"${cloudWatch.service} $name completed in $duration ms")

      a
    }

    block.transform(recordEnd(metricName), recordEnd(s"$metricName failed"))
  }
}
