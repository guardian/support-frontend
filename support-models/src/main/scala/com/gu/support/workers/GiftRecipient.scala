package com.gu.support.workers

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec

case class GiftRecipient(title: Option[String], firstName: String, lastName: String, email: Option[String])

object GiftRecipient {
  implicit val codec: Codec[GiftRecipient] = deriveCodec
}
