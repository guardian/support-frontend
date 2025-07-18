package com.gu

import com.typesafe.scalalogging.LazyLogging
import software.amazon.awssdk.awscore.AwsRequest
import software.amazon.awssdk.awscore.exception.AwsServiceException

import java.util.concurrent.CompletableFuture
import scala.concurrent.{Future, Promise}

class AwsAsyncHandler[Request <: AwsRequest, Response](
    f: (Request) => CompletableFuture[Response],
    request: Request,
    promise: Promise[Response] = Promise[Response](),
) extends LazyLogging {
  val result: CompletableFuture[Response] = f(request)

  result
    .thenAccept((response: Response) => {
      logger.debug(s"Successful result from AWS AsyncHandler")

      promise.success(response)
    })
    .exceptionally((exception: Throwable) => {
      logger.warn("Failure from AWSAsyncHandler", exception)

      exception match {
        case e: AwsServiceException =>
          if (e.awsErrorDetails.errorCode == "ThrottlingException") {
            logger.warn(
              "A rate limiting exception was thrown, we may need to adjust the rate limiting in ClientWrapper.scala",
            )
            Thread.sleep(1000) // Wait for a second and retry
            // Pass the promise from this instance down, so that it can be completed/failed later
            new AwsAsyncHandler(f, request, promise)
          } else {
            promise.failure(exception)
          }
        case _ => promise.failure(exception)
      }

      promise.failure(exception)

      null
    })

  def future: Future[Response] = promise.future
}

object AwsAsync {

  def apply[Request <: AwsRequest, Response](
      f: (Request) => CompletableFuture[Response],
      request: Request,
  ): Future[Response] = {
    val handler = new AwsAsyncHandler[Request, Response](f, request)
    handler.future
  }
}
