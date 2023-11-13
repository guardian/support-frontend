package com.gu.retry

object DelayedFuture {
  import java.util.{Timer, TimerTask}
  import scala.concurrent._
  import scala.concurrent.duration.FiniteDuration

  // Using Timer for this as we are not interested in multi-threading, just executing a single task potentially multiple times
  private val timer = new Timer(true)

  private def makeTask[T](
      body: => Future[T],
  )(schedule: TimerTask => Unit)(implicit ctx: ExecutionContext): Future[T] = {
    val prom = Promise[T]()
    schedule(
      new TimerTask {
        def run(): Unit =
          ctx.execute(() => {
            body.map(result => prom.success(result))
          })
      },
    )
    prom.future
  }
  def apply[T](delay: FiniteDuration)(body: => Future[T])(implicit ctx: ExecutionContext): Future[T] = {
    makeTask(body)(timer.schedule(_, delay.toMillis))
  }
}
