package com.gu.support.workers.lambdas

import java.io.{InputStream, OutputStream}

import com.amazonaws.services.lambda.runtime.{Context, RequestStreamHandler}
import com.gu.monitoring.SafeLogger
import com.gu.support.workers.exceptions.ErrorHandler
import com.gu.support.workers.{ExecutionError, RequestInfo}
import io.circe.{Decoder, Encoder}

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.util.control.NonFatal

abstract class Handler[IN, OUT](implicit
    decoder: Decoder[IN],
    encoder: Encoder[OUT],
    ec: ExecutionContext,
) extends RequestStreamHandler {

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
    val eventualUnit: Future[Unit] = for {
      inputData <- Future.fromTry(in(is))
      _ = SafeLogger.info(s"START  ${this.getClass} with $inputData")
      (input, error, requestInfo) = inputData
      result <- handlerFuture(input, error, requestInfo, context)
      _ = SafeLogger.info(s"FINISH ${this.getClass} with $result")
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
