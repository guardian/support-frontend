package com.gu.support.workers

import com.gu.i18n.Title
import com.gu.support.encoding.DiscriminatedType
import com.gu.support.encoding.CustomCodecs._

import io.circe._
import org.joda.time.LocalDate
import com.gu.support.encoding
import io.circe.generic.semiauto.deriveCodec

case class GiftRecipient(
    title: Option[Title],
    firstName: String,
    lastName: String,
    email: Option[String],
)
object GiftRecipient {
  implicit val codec: Codec[GiftRecipient] = deriveCodec
}
