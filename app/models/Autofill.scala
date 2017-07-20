package models

import codecs.CirceDecoders.deriveCodec
import codecs.Codec

case class Autofill(name: Option[String], email: Option[String])

object Autofill {
  implicit val codec: Codec[Autofill] = deriveCodec

  def empty: Autofill = Autofill(None, None)
}
