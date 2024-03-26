package com.gu.support.workers.lambdas

import ch.qos.logback.core.OutputStreamAppender

import java.io.{InputStream, OutputStream}
import com.amazonaws.services.lambda.runtime.{Context, LambdaRuntime, RequestStreamHandler}
import com.gu.monitoring.SafeLogging
import com.gu.support.workers.exceptions.ErrorHandler
import com.gu.support.workers.{ExecutionError, RequestInfo}
import io.circe.{Decoder, Encoder}

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.util.control.NonFatal

/** this appender makes sure that multi line messages stay together in cloudwatch
  */
class LambdaAppender[E] extends OutputStreamAppender[E] {
  override def start(): Unit = {
    println("Starting appender " + this.getClass.getName)
    setOutputStream(new OutputStream() {

      override def write(b: Int): Unit =
        LambdaRuntime.getLogger.log(Array(b.toByte))

      override def write(b: Array[Byte]): Unit =
        LambdaRuntime.getLogger.log(b)

      override def write(b: Array[Byte], off: Int, len: Int): Unit =
        LambdaRuntime.getLogger.log(b.slice(off, off + len))

      override def flush(): Unit =
        System.out.flush()
    })
    super.start()
  }
}
abstract class Handler[IN, OUT](implicit
    decoder: Decoder[IN],
    encoder: Encoder[OUT],
    ec: ExecutionContext,
) extends RequestStreamHandler
    with SafeLogging {

  import com.gu.support.workers.encoding.Encoding._

  type FutureHandlerResult = Future[HandlerResult[OUT]]

  override def handleRequest(is: InputStream, os: OutputStream, context: Context): Unit =
    try {
      Await.result(
        handleRequestFuture(is, os, context),
        Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS),
      )
    } catch {
      case n: Throwable if NonFatal(n) => throw n
      // this is to handle our of memory errors etc. and aim for a retry
      case t: Throwable => ErrorHandler.handleException(t)
    }

  def handleRequestFuture(is: InputStream, os: OutputStream, context: Context): Future[Unit] = {
    def log[T](message: String, a: T): Unit = {
      val prettyData = pprint.apply(a).plainText.replaceAll("\\n", "\n\t")
      logger.info(message + ":\n\t" + prettyData)
    }

    val eventualUnit: Future[Unit] = for {
      inputData <- Future.fromTry(in(is))
      _ = log(s"START  ${this.getClass} with", inputData)
      (input, error, requestInfo) = inputData
      result <- handlerFuture(input, error, requestInfo, context)
      _ = log(s"FINISH ${this.getClass} with", result)
      _ <- Future.fromTry(out(result, os))
    } yield ()
    eventualUnit.recover { case t =>
      ErrorHandler.handleException(t)
    }
  }

  protected def handlerFuture(
      input: IN,
      error: Option[ExecutionError],
      requestInfo: RequestInfo,
      context: Context,
  ): FutureHandlerResult

}

case class HandlerResult[RESULT](value: RESULT, requestInfo: RequestInfo)
