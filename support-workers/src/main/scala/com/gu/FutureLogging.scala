package com.gu

import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

object FutureLogging extends LazyLogging {

  implicit class LogImplicitFuture[A](op: Future[A]) {

    // this is just a handy method to add logging to the end of any for comprehension
    def withLogging(message: String): Future[A] = {
      op.transform { theTry =>
        logger.info(s"$message: continued processing with value: $theTry")
        theTry
      }
    }

  }

}
