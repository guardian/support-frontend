package utils

import com.typesafe.scalalogging.LazyLogging
import play.api.mvc.RequestHeader

object CheckBrowser extends LazyLogging {
  val unsupportedUA = "SamsungBrowser/3"
  def unsupportedBrowser(implicit request: RequestHeader): Boolean = {
    val ua = request.headers.get("User-Agent")
    logger.info(s"### UA: $ua")
    val unsupported = ua.exists(_.contains(unsupportedUA))
    logger.info(s"### Unsupported: $unsupported")
    unsupported
  }
}
