package views

import play.twirl.api.Html

case class StyleContent(value: Html) extends AnyVal

sealed trait ReactDiv {
  def fold[C](fa: EmptyDiv => C, fb: SSRContent => C): C = (this match {
    case e: EmptyDiv => Left(e)
    case r: SSRContent => Right(r)
  }).fold(fa, fb)
}
case class EmptyDiv(value: String) extends ReactDiv
case class SSRContent(value: String, content: Html) extends ReactDiv

/*
	title: String,
	mainId: String,
	mainJsBundle: String,
	mainStyleBundle: Either[RefPath, StyleContent],// left is ref path, right is inline
	description: Option[String] = None,
	canonicalLink: Option[String] = None,
	hrefLangLinks: Map[String, String] = Map(),
  data: Map[String, String] = Map.empty,
  csrf: Option[String] = None,
 */
