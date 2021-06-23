package com.gu.support.acquisitions.utils

import scala.concurrent.{Future, ExecutionContext}
import cats.data.EitherT
import cats.instances.future._

object Retry {
  def apply[A, B](max: Int)(f: => EitherT[Future, A, B])(implicit ec: ExecutionContext): EitherT[Future, A, B] = {
    def attempt(triesLeft: Int): EitherT[Future, A, B] = {
      f.leftFlatMap(error => {
        if (triesLeft > 0) attempt(triesLeft - 1) else EitherT.fromEither(Left(error))
      })
    }

    attempt(max)
  }
}
