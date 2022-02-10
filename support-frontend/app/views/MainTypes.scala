package views

import play.twirl.api.Html

sealed trait ReactDiv {
  def fold[C](fa: EmptyDiv => C, fb: SSRContent => C): C = (this match {
    case e: EmptyDiv => Left(e)
    case r: SSRContent => Right(r)
  }).fold(fa, fb)
}
case class EmptyDiv(value: String) extends ReactDiv
case class SSRContent(value: String, content: Html, classes: Option[String] = None) extends ReactDiv

case class Preload(href: String, as: String, typeAttr: String)
