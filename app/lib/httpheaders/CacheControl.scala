package lib.httpheaders

import scala.concurrent.duration._

object CacheControl {

  val defaultStaleIfErrors = 10.days

  def browser(maxAge: FiniteDuration): (String, String) = {
    "Cache-Control" -> standardDirectives(maxAge, 1.second max (maxAge / 10), defaultStaleIfErrors)
  }

  def cdn(maxAge: FiniteDuration): (String, String) = {
    "Surrogate-Control" -> standardDirectives(maxAge, 1.second max (maxAge / 10), defaultStaleIfErrors)
  }

  val noCache: (String, String) = "Cache-Control" -> "private"

  private def standardDirectives(maxAge: FiniteDuration, staleWhileRevalidate: FiniteDuration, staleIfErrors: FiniteDuration) =
    s"max-age=${maxAge.toSeconds}, stale-while-revalidate=${staleWhileRevalidate.toSeconds}, stale-if-error=${staleIfErrors.toSeconds}"
}