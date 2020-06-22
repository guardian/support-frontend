package views

import play.twirl.api.Html

object JsStringLiteral {

  def apply(rawString: String): Html =
    Html(s""""${rawString.replaceAll(""""""", """\\"""")}"""")

  def fromOption(maybeRawString: Option[String]): Html =
    maybeRawString match {
      case Some(rawString) => apply(rawString)
      case None => Html("""""""")
    }
}
