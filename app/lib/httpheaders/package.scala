package lib

import org.joda.time.{DateTime, DateTimeZone}
import org.joda.time.format.DateTimeFormat

package object httpheaders {

  trait HttpHeader {
    def key: String
    def value: String
    def header: (String, String) = key -> value
  }

  //http://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
  private val HTTPDateFormat = DateTimeFormat.forPattern("EEE, dd MMM yyyy HH:mm:ss 'GMT'").withZone(DateTimeZone.UTC)

  implicit class DateTime2ToHttpDateFormat(date: DateTime) {
    def toHttpDateTimeString: String = date.toString(HTTPDateFormat)
  }
}
