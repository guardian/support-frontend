package views

import io.circe.{Encoder, Printer}
import io.circe.syntax._
import play.api.mvc.RequestHeader

object ViewHelpers {
  def doNotTrack(implicit request: RequestHeader): Boolean = request.headers.get("DNT").contains("1")
  def outputJson[T: Encoder](value: T): String =
    value.asJson
      .printWith(Printer.noSpaces.copy(dropNullValues = true))
}
