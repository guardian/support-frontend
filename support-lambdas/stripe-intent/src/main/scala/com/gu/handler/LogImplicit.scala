package com.gu.handler

import com.gu.monitoring.SafeLogger

import scala.concurrent.{ExecutionContext, Future}

trait LogImplicit {

  implicit class LogImplicit2[A](value: Future[A]) {

    // this is just a handy method to add logging to the end of any value
    def withLogging(message: String)(implicit executionContext: ExecutionContext): Future[A] = {
      value.transform { res =>
        SafeLogger.info(s"$message: $res")
        res
      }
    }

  }

}
