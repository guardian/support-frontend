package com.gu.zuora.model

import io.circe.generic.semiauto._

object SubscribeOptions {
  implicit val decoder = deriveDecoder[SubscribeOptions]
  implicit val encoder = deriveEncoder[SubscribeOptions]
}
case class SubscribeOptions(generateInvoice: Boolean = true, processPayments: Boolean = true)
