package com.gu.zuora.model

import com.gu.zuora.encoding.CapitalizationEncoder._
import io.circe.{Decoder, Encoder}

object SubscribeOptions {
  implicit val decoder: Encoder[SubscribeOptions] = capitalizingEncoder
  implicit val encoder: Decoder[SubscribeOptions] = decapitalizingDecoder
}
case class SubscribeOptions(generateInvoice: Boolean = true, processPayments: Boolean = true)
