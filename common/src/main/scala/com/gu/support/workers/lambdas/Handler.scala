package com.gu.support.workers.lambdas

import java.io.{InputStream, OutputStream}

import com.amazonaws.services.lambda.runtime.{Context, RequestStreamHandler}
import com.gu.support.workers.exceptions.ErrorHandler
import com.gu.support.workers.model.{ExecutionError, RequestInformation}
import io.circe.{Decoder, Encoder}

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}

abstract class Handler[T, R](implicit decoder: Decoder[T], encoder: Encoder[R]) extends RequestStreamHandler {

  import com.gu.support.workers.encoding.Encoding._

  type HandlerResult = (R, RequestInformation)

  def handlerResult(r: R, ri: RequestInformation): HandlerResult = (r, ri)

  protected def handler(input: T, error: Option[ExecutionError], requestInformation: RequestInformation, context: Context): HandlerResult

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

  type FutureHandlerResult = Future[(R, RequestInformation)]

  def futureHandlerResult(r: R, ri: RequestInformation): FutureHandlerResult = Future.successful((r, ri))

  protected def handlerFuture(input: T, error: Option[ExecutionError], requestInformation: RequestInformation, context: Context): FutureHandlerResult

  override protected def handler(input: T, error: Option[ExecutionError], requestInformation: RequestInformation, context: Context): HandlerResult =
    Await.result(
      handlerFuture(input, error, requestInformation, context),
      d.getOrElse(Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS))
    )
}

