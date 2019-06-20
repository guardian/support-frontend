package com.gu.support.workers

import com.gu.i18n.Title
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._

case class GiftRecipient(title: Option[Title], firstName: String, lastName: String, email: Option[String])

object GiftRecipient {
  implicit val codec: Codec[GiftRecipient] = deriveCodec
}
