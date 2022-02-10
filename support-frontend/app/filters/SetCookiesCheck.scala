package filters

import scala.concurrent.{ExecutionContext, Future}
import akka.stream.Materializer
import play.api.mvc._
import play.api.http.Status.{MOVED_PERMANENTLY, NOT_FOUND, OK}
import play.api.mvc.request.RequestAttrKey
import play.api.mvc.request.LazyCell

class SetCookiesCheck(implicit val mat: Materializer, ec: ExecutionContext) extends Filter {

  private val cacheableStatusCodes = Seq(OK, MOVED_PERMANENTLY, NOT_FOUND)

  def apply(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader): Future[Result] = {

    nextFilter(requestHeader).map { result =>
      def suitableForCaching = cacheableStatusCodes.contains(result.header.status)
      def setsCookies = result.newCookies.nonEmpty || result.newFlash.nonEmpty || result.newSession.nonEmpty
      def cacheControlPrivate = result.header.headers.get("Cache-Control").exists(_.contains("no-cache, private"))
      def cookiesAccessed = requestHeader.attrs.get(RequestAttrKey.Cookies).collect {
        case cell: LazyCell[Cookies] => cell.evaluated
      } getOrElse true

      if (suitableForCaching && !cacheControlPrivate) {
        assert(
          assertion = !setsCookies,
          message = s"Response sets cookies - ensure controller response has correct Cache-Control header set for ${requestHeader.path}"
        )
        assert(
          assertion = !cookiesAccessed,
          message = s"Endpoint accesses cookies - ensure controller response has correct Cache-Control header set for ${requestHeader.path}"
        )
      }
      result
    }
  }
}
