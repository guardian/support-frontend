package com.gu.support.workers.lambdas

import java.io.{InputStream, OutputStream}

import com.amazonaws.services.lambda.runtime.{Context, RequestStreamHandler}
import com.gu.support.workers.exceptions.ErrorHandler
import com.gu.support.workers.model.{ExecutionError, RequestInfo}
import io.circe.{Decoder, Encoder}

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}

abstract class Handler[T, R](implicit decoder: Decoder[T], encoder: Encoder[R]) extends RequestStreamHandler {

  import com.gu.support.workers.encoding.Encoding._

  type HandlerResult = (R, RequestInfo)

  def HandlerResult(r: R, ri: RequestInfo): HandlerResult = (r, ri) // scalastyle:ignore method.name

  protected def handler(input: T, error: Option[ExecutionError], requestInfo: RequestInfo, context: Context): HandlerResult

  def handleRequest(is: InputStream, os: OutputStream, context: Context): Unit =
    try {
      in(is).flatMap {
        case (i, error, requestInfo) =>
          val result = handler(i, error, requestInfo, context)
          out(result._1, result._2, os)
      }.get
    } catch ErrorHandler.handleException
}

abstract class FutureHandler[T, R](d: Option[Duration] = None)(
    implicit
    decoder: Decoder[T],
    encoder: Encoder[R],
    ec: ExecutionContext
) extends Handler[T, R] {

  type FutureHandlerResult = Future[(R, RequestInfo)]

  def FutureHandlerResult(r: R, ri: RequestInfo): FutureHandlerResult = Future.successful((r, ri)) // scalastyle:ignore method.name

  protected def handlerFuture(input: T, error: Option[ExecutionError], requestInfo: RequestInfo, context: Context): FutureHandlerResult

  override protected def handler(input: T, error: Option[ExecutionError], requestInfo: RequestInfo, context: Context): HandlerResult =
    Await.result(
      handlerFuture(input, error, requestInfo, context),
      d.getOrElse(Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS))
    )
}

