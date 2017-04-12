package filters

import scala.concurrent.Future
import akka.stream.Materializer
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.http.Status.{MOVED_PERMANENTLY, NOT_FOUND, OK}

class CheckCacheHeadersFilter(implicit val mat: Materializer) extends Filter {

  private val cacheableStatusCodes = Seq(OK, MOVED_PERMANENTLY, NOT_FOUND)

  private def suitableForCaching(result: Result) =
    cacheableStatusCodes.contains(result.header.status)

  def apply(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader): Future[Result] = {
    nextFilter(requestHeader).map { result =>
      if (suitableForCaching(result)) {
        assert(
          assertion = result.header.headers.contains("Cache-Control"),
          message = s"Cache-Control not set. Ensure controller response has Cache-Control header set for ${requestHeader.path}"
        )
      }
      result
    }
  }
}