package com.gu.support.workers.lambdas

import java.io.{InputStream, OutputStream}

import com.amazonaws.services.lambda.runtime.{Context, RequestStreamHandler}
import com.gu.support.workers.exceptions.ErrorHandler
import com.gu.support.workers.{ExecutionError, RequestInfo}
import io.circe.{Decoder, Encoder}

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}

abstract class Handler[T, R](
  implicit
  decoder: Decoder[T],
  encoder: Encoder[R],
  ec: ExecutionContext
) extends RequestStreamHandler {

  import com.gu.support.workers.encoding.Encoding._

  type HandlerResult = (R, RequestInfo)

  type FutureHandlerResult = Future[HandlerResult]

  def HandlerResult(r: R, ri: RequestInfo): HandlerResult = (r, ri) // scalastyle:ignore method.name

  def FutureHandlerResult(r: R, ri: RequestInfo): FutureHandlerResult = Future.successful((r, ri)) // scalastyle:ignore method.name

  override def handleRequest(is: InputStream, os: OutputStream, context: Context): Unit =
    Await.result(
      handleRequestFuture(is, os, context),
      Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS)
    )

  def handleRequestFuture(is: InputStream, os: OutputStream, context: Context): Future[Unit] = {
    val eventualUnit: Future[Unit] = for {
      inputData <- Future.fromTry(in(is))
      (input, error, requestInfo) = inputData
      result <- handlerFuture(input, error, requestInfo, context)
      _ <- Future.fromTry(out(result._1, result._2, os))
    } yield ()
    eventualUnit.recover {
      case t => ErrorHandler.handleException(t)
    }
  }

  protected def handlerFuture(input: T, error: Option[ExecutionError], requestInfo: RequestInfo, context: Context): FutureHandlerResult

}

