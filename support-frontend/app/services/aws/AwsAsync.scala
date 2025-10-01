package services.aws

import com.typesafe.scalalogging.LazyLogging
import software.amazon.awssdk.awscore.AwsRequest
import software.amazon.awssdk.awscore.exception.AwsServiceException

import java.util.concurrent.CompletableFuture
import scala.concurrent.{Future, Promise}

class AwsAsyncHandler[Request <: AwsRequest, Response](
    f: Request => CompletableFuture[Response],
    request: Request,
    promise: Promise[Response] = Promise[Response](),
) extends LazyLogging {
  val result: CompletableFuture[Response] = f(request)

  result
    .thenAccept((response: Response) => {
      logger.debug(s"Successful result from AwsAsyncHandler")
      promise.success(response)
    })
    .exceptionally((exception: Throwable) => {
      logger.warn("Failure from AwsAsyncHandler", exception)
      promise.failure(exception)
      null
    })

  def future: Future[Response] = promise.future
}

object AwsAsync {

  def apply[Request <: AwsRequest, Response](
      f: Request => CompletableFuture[Response],
      request: Request,
  ): Future[Response] = {
    val handler = new AwsAsyncHandler[Request, Response](f, request)
    handler.future
  }
}
