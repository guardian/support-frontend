package com.gu.retry

import cats.data.EitherT

import scala.concurrent.duration.FiniteDuration
import scala.concurrent.{ExecutionContext, Future}

/** retry implementation based on this gist from Scala Future contributor https://gist.github.com/viktorklang/9414163
  */
object EitherTRetry {

  /** Given an operation that produces a EitherT[Future, A, B], returns that value, unless an exception is thrown, in
    * which case the operation will be retried after _delay_ time if retries, which is configured through the _retries_
    * parameter, is greater than 0. If the operation does not succeed and there are no retries left, the resulting
    * EitherT will contain the last failure.
    */
  def retry[A, B](op: => EitherT[Future, A, B], delay: FiniteDuration, retries: Int)(implicit
      ec: ExecutionContext,
  ): EitherT[Future, A, B] = {
    op.recoverWith {
      case _ if retries > 0 =>
        println(s"Number of remaining attempts is $retries")
        EitherT(
          DelayedFuture(delay)(retry(op, delay, retries - 1).value),
        )
    }
  }

}
