package utils

import monitoring.SafeLogger
import play.api.mvc.RequestHeader

object BrowserCheck {
  def logUserAgent(implicit request: RequestHeader): Unit = {
    SafeLogger.warn(s"Unsupported user agent: ${
      request.headers.get("User-Agent").getOrElse("No User-Agent available in request.headers")
    }")
  }
}