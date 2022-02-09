package com.gu.support.workers

import com.gu.i18n.Country
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec

case class Address(
    lineOne: Option[String],
    lineTwo: Option[String],
    city: Option[String],
    state: Option[String],
    postCode: Option[String],
    country: Country,
)

object Address {
  implicit val AddressCodec: Codec[Address] = {
    import com.gu.support.encoding.CustomCodecs._
    deriveCodec
  }
}
