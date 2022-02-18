package utils

import scala.concurrent.duration._
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import akka.pattern.after
import akka.actor.Scheduler
import cats.data.EitherT
import com.gu.monitoring.SafeLogger

/** retry implementation from Scala Future contributor https://gist.github.com/viktorklang/9414163
  */
object EitherTRetry {

  /** Given an operation that produces a EitherT[Future, A, B], returns that value, unless an exception is thrown, in
    * which case the operation will be retried after _delay_ time, if there are more possible retries, which is
    * configured through the _retries_ parameter. If the operation does not succeed and there is no retries left, the
    * resulting Future will contain the last failure.
    */
  def retry[A, B](op: => EitherT[Future, A, B], delay: FiniteDuration, retries: Int)(implicit
      ec: ExecutionContext,
      s: Scheduler,
  ): EitherT[Future, A, B] = {
    SafeLogger.info(s"Future.retry trying with $retries left")
    op.recoverWith { case _ if retries > 0 => EitherT(after(delay, s)(retry(op, delay, retries - 1).value)) }
  }

}
