package com.gu.aws

import java.util.concurrent.{Future => JFuture}
import com.amazonaws.handlers.AsyncHandler
import com.amazonaws.{AmazonServiceException, AmazonWebServiceRequest}
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.{Future, Promise}

class AwsAsyncHandler[Request <: AmazonWebServiceRequest, Response](
    f: (Request, AsyncHandler[Request, Response]) => JFuture[Response],
    request: Request,
) extends AsyncHandler[Request, Response]
    with LazyLogging {
  f(request, this)

  private val promise = Promise[Response]()

  override def onError(exception: Exception): Unit = {
    logger.warn("Failure from AWSAsyncHandler", exception)
    exception match {
      case e: AmazonServiceException =>
        if (e.getErrorCode == "ThrottlingException") {
          logger.warn(
            "A rate limiting exception was thrown, we may need to adjust the rate limiting in ClientWrapper.scala",
          )
          Thread.sleep(1000) // Wait for a second and retry
          f(request, this)
        } else {
          promise.failure(exception)
        }
      case _ => promise.failure(exception)
    }
  }

  override def onSuccess(request: Request, result: Response): Unit = {
    logger.debug(s"Successful result from AWS AsyncHandler")
    promise.success(result)
  }

  def future: Future[Response] = promise.future
}

object AwsAsync {

  def apply[Request <: AmazonWebServiceRequest, Response](
      f: (Request, AsyncHandler[Request, Response]) => JFuture[Response],
      request: Request,
  ): Future[Response] = {
    val handler = new AwsAsyncHandler[Request, Response](f, request)
    handler.future
  }
}
