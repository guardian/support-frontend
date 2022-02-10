package actions

import org.joda.time.DateTime

import scala.concurrent.duration._
import HttpHeaders._

object CacheControl {

  val defaultStaleIfErrors = 10.days

  def browser(maxAge: FiniteDuration): (String, String) = {
    "Cache-Control" -> standardDirectives(maxAge, 1.second max (maxAge / 10), defaultStaleIfErrors)
  }

  def cdn(maxAge: FiniteDuration): (String, String) = {
    "Surrogate-Control" -> standardDirectives(maxAge, 1.second max (maxAge / 10), defaultStaleIfErrors)
  }

  val noCache: (String, String) = "Cache-Control" -> "no-cache, private"

  private def standardDirectives(
      maxAge: FiniteDuration,
      staleWhileRevalidate: FiniteDuration,
      staleIfErrors: FiniteDuration,
  ) =
    s"max-age=${maxAge.toSeconds}, stale-while-revalidate=${staleWhileRevalidate.toSeconds}, stale-if-error=${staleIfErrors.toSeconds}"

  def defaultCacheHeaders(
      maxAge: FiniteDuration,
      browserAge: FiniteDuration,
      now: DateTime = DateTime.now,
  ): List[(String, String)] = {
    val expires = now.plusSeconds(browserAge.toSeconds.toInt)

    List(
      CacheControl.cdn(maxAge),
      CacheControl.browser(browserAge),
      "Expires" -> expires.toHttpDateTimeString,
      "Date" -> now.toHttpDateTimeString,
      "Vary" -> "DNT",
    )
  }
}
