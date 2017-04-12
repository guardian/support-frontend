package lib.actions

import scala.concurrent.duration._
import org.scalatest.{MustMatchers, WordSpec}
import play.api.mvc.Results.Ok
import play.api.test.FakeRequest
import play.api.test.Helpers._
import org.joda.time.format.DateTimeFormat
import org.joda.time.{DateTime, Seconds}

class CachedActionTest extends WordSpec with MustMatchers {

  "with no arguments" should {
    "expire in 60 seconds" in {
      val result = CachedAction(Ok("")).apply(FakeRequest())
      val Some(date) = header("Date", result)
      val Some(expiry) = header("Expires", result)
      Seconds.secondsBetween(parseHttpDate(date), parseHttpDate(expiry)).getSeconds mustEqual 60
    }

    "browser cache control max-age of 60 seconds with 10% time for revalidation and 10 days stale on error" in {
      val result = CachedAction(Ok("")).apply(FakeRequest())
      header("Cache-Control", result) mustEqual Some("max-age=60, stale-while-revalidate=6, stale-if-error=864000")
    }

    "cdn cache control max-age of 60 seconds with 10% time for revalidation and 10 days stale on error" in {
      val result = CachedAction(Ok("")).apply(FakeRequest())
      header("Surrogate-Control", result) mustEqual Some("max-age=60, stale-while-revalidate=6, stale-if-error=864000")
    }
  }

  "with maxAge of 1 hour" should {
    "expire in 60 seconds" in {
      val result = CachedAction(1.hour)(Ok("")).apply(FakeRequest())
      val Some(date) = header("Date", result)
      val Some(expiry) = header("Expires", result)
      Seconds.secondsBetween(parseHttpDate(date), parseHttpDate(expiry)).getSeconds mustEqual 60
    }

    "browser cache control max-age of 60 seconds with 10% time for revalidation and 10 days stale on error" in {
      val result = CachedAction(1.hour)(Ok("")).apply(FakeRequest())
      header("Cache-Control", result) mustEqual Some("max-age=60, stale-while-revalidate=6, stale-if-error=864000")
    }

    "cdn cache control max-age of 3600 seconds with 10% time for revalidation and 10 days stale on error" in {
      val result = CachedAction(1.hour)(Ok("")).apply(FakeRequest())
      header("Surrogate-Control", result) mustEqual Some("max-age=3600, stale-while-revalidate=360, stale-if-error=864000")
    }
  }

  private val httpDateFormatter = DateTimeFormat.forPattern("EEE, dd MMM yyyy HH:mm:ss 'GMT'")

  private def parseHttpDate(d: String): DateTime = DateTime.parse(d, httpDateFormatter)
}
