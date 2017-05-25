package com.gu.support.workers.lambdas

import java.io.{InputStream, OutputStream}

import com.amazonaws.services.lambda.runtime.{Context, RequestStreamHandler}
import io.circe.{Decoder, Encoder}
import org.slf4j.LoggerFactory

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}

abstract class Handler[T, R](implicit decoder: Decoder[T], encoder: Encoder[R]) extends RequestStreamHandler {
  val logger = LoggerFactory.getLogger(this.getClass.getSimpleName)
  import com.gu.support.workers.encoding.Encoding._

  protected def handler(input: T, context: Context): R
  def handleRequest(is: InputStream, os: OutputStream, context: Context): Unit = {
    logger.info(s"Starting request: ${context.getClientContext.getEnvironment}")
    in(is).flatMap(i => out(handler(i, context), os)).get
    logger.info(s"Completed request: $context")
  }
}

abstract class FutureHandler[T, R](d: Option[Duration] = None)(
    implicit
    decoder: Decoder[T],
    encoder: Encoder[R],
    ec: ExecutionContext
) extends Handler[T, R] {
  protected def handlerFuture(input: T, context: Context): Future[R]
  protected def handler(input: T, context: Context): R = Await.result(
    handlerFuture(input, context),
    d.getOrElse(Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS))
  )
}

