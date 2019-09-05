package com.gu.support.workers.lambdas

import java.io.{InputStream, OutputStream}

import cats.{Applicative, Functor, Id}
import com.amazonaws.services.lambda.runtime.{Context, RequestStreamHandler}
import com.gu.support.workers.exceptions.ErrorHandler
import com.gu.support.workers.{ExecutionError, RequestInfo}
import io.circe.{Decoder, Encoder}

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.language.higherKinds

abstract class Handler[T, R](
  implicit
  decoder: Decoder[T],
  encoder: Encoder[R],
  ec: ExecutionContext
) extends RequestStreamHandler {

  import com.gu.support.workers.encoding.Encoding._

  type HandlerResult = (R, RequestInfo)

  type FutureHandlerResult = Future[(R, RequestInfo)]

  def HandlerResult(r: R, ri: RequestInfo): HandlerResult = (r, ri) // scalastyle:ignore method.name

  def FutureHandlerResult(r: R, ri: RequestInfo): FutureHandlerResult = Future.successful((r, ri)) // scalastyle:ignore method.name

  override def handleRequest(is: InputStream, os: OutputStream, context: Context): Unit =
    handleRequestExtractFunctor[Id](is, os, context, await(context)_)

  def handleRequestExtractFunctor[F[_] : Applicative](
    is: InputStream,
    os: OutputStream,
    context: Context,
    resultToResult: FutureHandlerResult => F[HandlerResult]
  ): F[Unit] = {
    try {
      in(is).map {
        case (input, error, requestInfo) =>
          implicitly[Functor[F]].map(resultToResult(handlerFuture(input, error, requestInfo, context))) { result =>
            out(result._1, result._2, os).get
          }
      }.get
    } catch {
      case t: Throwable/*TODO all throwables?*/ => ErrorHandler.handleException(t)
      implicitly[Applicative[F]].pure(()) // hmm, still need a future if we throw an exception? TODO think harder
    }
  }

  protected def handlerFuture(input: T, error: Option[ExecutionError], requestInfo: RequestInfo, context: Context): FutureHandlerResult

  protected def await(context: Context)(futureHandlerResult: FutureHandlerResult): Id[HandlerResult] =
    Await.result(
      futureHandlerResult,
      Duration(context.getRemainingTimeInMillis.toLong, MILLISECONDS)
    )

}

