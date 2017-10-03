package com.gu.support.workers.lambdas

import java.io.{InputStream, OutputStream}

import com.amazonaws.services.lambda.runtime.{Context, RequestStreamHandler}
import com.gu.support.workers.exceptions.ErrorHandler
import com.gu.support.workers.model.ExecutionError
import io.circe.{Decoder, Encoder}

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}

abstract class Handler[T, R](implicit decoder: Decoder[T], encoder: Encoder[R]) extends RequestStreamHandler {
  import com.gu.support.workers.encoding.Encoding._

  protected def handler(input: T, error: Option[ExecutionError], context: Context): R

  def handleRequest(is: InputStream, os: OutputStream, context: Context): Unit =
    try {
      in(is).flatMap({ case (i, encrypted, error) => out(handler(i, error, context), encrypted, os) }).get
    } catch ErrorHandler.handleException
}

abstract class FutureHandler[T, R](d: Option[Duration] = None)(
    implicit
    decoder: Decoder[T],
    encoder: Encoder[R],
    ec: ExecutionContext
) extends Handler[T, R] {
  protected def handlerFuture(input: T, error: Option[ExecutionError], context: Context): Future[R]

  override protected def handler(input: T, error: Option[ExecutionError], context: Context): R = Await.result(
    handlerFuture(input, error, context),
    d.getOrElse(Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS))
  )
}

