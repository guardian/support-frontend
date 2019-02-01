package views

import play.api.mvc.RequestHeader
import play.twirl.api.{Html, HtmlFormat}
import admin.AllSettings
import admin.AllSettings.allSettingsCodec
import io.circe.{Encoder, Printer}
import io.circe.syntax._

object ViewHelpers {
  def doNotTrack(implicit request: RequestHeader): Boolean = request.headers.get("DNT").contains("1")
  def mapToDataset(data: Map[String, String]): Iterable[Html] =
    data.map {
      case (key, value) =>
        Html(s"""data-${HtmlFormat.escape(key.replaceAll("[^a-zA-Z0-9\\-]", ""))}="${HtmlFormat.escape(value)}" """)
    }
  def outputJson[T](value: T)(implicit encoder: Encoder[T]): String =
    value
      .asJson
      .pretty(Printer.spaces2.copy(dropNullValues = true))
}
