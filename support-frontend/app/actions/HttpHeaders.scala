package actions

import org.joda.time.format.DateTimeFormat
import org.joda.time.{DateTime, DateTimeZone}

object HttpHeaders {

  trait HttpHeader {
    def key: String
    def value: String
    def header: (String, String) = key -> value
  }

  // http://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
  private val HTTPDateFormat = DateTimeFormat.forPattern("EEE, dd MMM yyyy HH:mm:ss 'GMT'").withZone(DateTimeZone.UTC)

  implicit class DateTime2ToHttpDateFormat(date: DateTime) {
    def toHttpDateTimeString: String = date.toString(HTTPDateFormat)
  }

  def mergeHeader(header: String, headers: List[(String, String)]): List[(String, String)] = {
    val (selected, others) = headers.partition(_._1.toLowerCase == header.toLowerCase)
    if (selected.isEmpty) {
      others
    } else {
      val selectedValues = selected.map(_._2)
      (header -> selectedValues.mkString(", ")) :: others
    }
  }
}
