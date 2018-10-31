package views

import play.api.mvc.RequestHeader
import admin.Settings
import codecs.CirceDecoders._
import io.circe.Printer
import io.circe.syntax._
import org.joda.time.{DateTime, DateTimeZone}

object ViewHelpers {
  def doNotTrack(implicit request: RequestHeader): Boolean = request.headers.get("DNT").contains("1")
  def printSettings(settings: Settings): String =
    settings
      .asJson
      .pretty(Printer.spaces2.copy(dropNullValues = true))
  def showTweakedHeader: Boolean = {
    val now = DateTime.now().withZone(DateTimeZone.UTC)
    val threshold = DateTime.parse("2018-11-07T06:00:00").withZone(DateTimeZone.UTC)
    now.isAfter(threshold)
  }
}
