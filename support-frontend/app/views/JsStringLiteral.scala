package views

import play.twirl.api.Html

object JsStringLiteral {

  def apply(rawString: String): Html = {
    val cleanString = rawString.flatMap {
      case '<' => "\\u003c"
      case '>' => "\\u003e"
      case '"' => "\\u0022"
      case '\'' => "\\u0027"
      case '\\' => "\\u005c"
      case '&' => "\\u0026"
      case other => other.toString
    }
    Html(s""""$cleanString"""")
  }

  def fromOption(maybeRawString: Option[String]): Html =
    maybeRawString match {
      case Some(rawString) => apply(rawString)
      case None => Html("""""""")
    }
}
