package com.gu.support.redemption.corporate

import com.gu.monitoring.SafeLogger

import scala.concurrent.{ExecutionContext, Future}

trait WithLogging {

  implicit class LogImplicit2[A](value: Future[A]) {

    // this is just a handy method to add logging to the end of any value
    def withLoggingAsync(message: String)(implicit executionContext: ExecutionContext): Future[A] = {
      value.transform { res =>
        SafeLogger.info(s"$message: $res")
        res
      }
    }

  }

  implicit class LogImplicit[A](value: A) {

    // this is just a handy method to add logging to the end of any value
    def withLogging(message: String): A = {
      SafeLogger.info(s"$message: $value")
      value
    }

  }

}
