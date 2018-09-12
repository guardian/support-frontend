package views

import play.api.mvc.RequestHeader
import admin.AdminSettings
import codecs.CirceDecoders._
import io.circe.Printer
import io.circe.syntax._

object ViewHelpers {
  def doNotTrack(implicit request: RequestHeader): Boolean = request.headers.get("DNT").contains("1")
  def printSettings(settings: AdminSettings): String =
    settings
      .asJson
      .pretty(Printer.spaces2.copy(dropNullValues = true))
}
