package filters

import org.apache.pekko.stream.Materializer
import play.api.mvc.{Filter, RequestHeader, Result}

import scala.concurrent.{ExecutionContext, Future}

/** Adds a report-only CSP containing just a `connect-src` directive, so we can trial a tighter policy for fetch/XHR/
  * WebSocket connections without risking blocking anything. The enforced policy is set by Play's CSP filter.
  *
  * Does nothing if no sources are configured.
  */
class ConnectSrcReportOnlyFilter(connectSrc: Option[String])(implicit val mat: Materializer, ec: ExecutionContext)
    extends Filter {

  private val headerValue = connectSrc.map(_.trim).filter(_.nonEmpty).map(sources => s"connect-src $sources")

  def apply(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader): Future[Result] =
    nextFilter(requestHeader).map { result =>
      headerValue.fold(result)(value => result.withHeaders("Content-Security-Policy-Report-Only" -> value))
    }
}
