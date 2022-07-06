package com.gu.support.acquisitions.utils

import scala.concurrent.{Future, ExecutionContext}
import cats.data.EitherT

object Retry {
  def apply[A, B](max: Int)(f: => EitherT[Future, A, B])(implicit ec: ExecutionContext): EitherT[Future, List[A], B] = {
    def attempt(triesLeft: Int, errors: List[A]): EitherT[Future, List[A], B] = {
      f.leftFlatMap(error => {
        if (triesLeft > 0) attempt(triesLeft - 1, error +: errors) else EitherT.fromEither(Left(error +: errors))
      })
    }

    attempt(max, Nil)
  }
}
