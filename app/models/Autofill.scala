package models

import com.gu.support.encoding.Codec._
import com.gu.support.encoding.Codec

case class Autofill(id: Option[String], name: Option[String], email: Option[String])

object Autofill {
  implicit val codec: Codec[Autofill] = deriveCodec

  def empty: Autofill = Autofill(id = None, name = None, email = None)
}
