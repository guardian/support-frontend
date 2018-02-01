package utils

import com.typesafe.scalalogging.LazyLogging
import play.api.mvc.RequestHeader

object BrowserCheck extends LazyLogging {
  def logUserAgent(implicit request: RequestHeader): Unit = {
    logger.warn(s"Unsupported user agent: ${
      request.headers.get("User-Agent").getOrElse("No User-Agent available in request.headers")
    }")
  }
}