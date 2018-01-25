package utils

import com.typesafe.scalalogging.LazyLogging
import play.api.mvc.RequestHeader
import scala.util.matching.Regex

object CheckBrowser extends LazyLogging {
  val unsupportedBrowsers: Seq[Regex] = Seq(
    """SamsungBrowser\/[1-3]""".r,
    """SamsungBrowser\/5.[24]""".r
  )

  def unsupportedBrowser(implicit request: RequestHeader): Boolean = {
    request.headers.get("User-Agent").flatMap { ua =>
      unsupportedBrowsers.collectFirst({
        case ex: Regex if ex.findFirstIn(ua).isDefined =>
          logger.warn(s"Unsupported user agent: $ua")
          true
      })
    }.getOrElse(false)
  }
}
