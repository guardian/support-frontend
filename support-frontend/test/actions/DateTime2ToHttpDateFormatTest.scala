package actions

import org.joda.time.{DateTime, DateTimeZone}
import HttpHeaders._
import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.must.Matchers

class DateTime2ToHttpDateFormatTest extends AnyWordSpec with Matchers {

  "correctly format the example date from https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1" in {
    val timestamp = new DateTime(1994, 11, 6, 8, 49, 37, DateTimeZone.UTC) // scalastyle:off magic.number
    timestamp.toHttpDateTimeString mustEqual "Sun, 06 Nov 1994 08:49:37 GMT"
  }
}
