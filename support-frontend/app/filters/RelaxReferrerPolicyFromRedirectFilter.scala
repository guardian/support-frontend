package filters
import akka.stream.Materializer
import play.api.mvc.{Filter, RequestHeader, Result}
import play.filters.headers.SecurityHeadersFilter

import scala.concurrent.{ExecutionContext, Future}

class RelaxReferrerPolicyFromRedirectFilter(implicit val mat: Materializer, ec: ExecutionContext) extends Filter {

  def apply(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader): Future[Result] =
    nextFilter(requestHeader).map { result =>
      // standard redirects from Play are 302s, this is just for good measure
      val redirects = List(300, 301, 302, 303, 304, 307, 308)
      val isRedirect = redirects.contains(result.header.status)

      if (isRedirect) {
        result.withHeaders(SecurityHeadersFilter.REFERRER_POLICY -> "no-referrer-when-downgrade")
      } else {
        result
      }
    }
}
