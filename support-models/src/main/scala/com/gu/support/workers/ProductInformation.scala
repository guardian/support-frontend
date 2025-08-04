package com.gu.support.workers

case class ProductInformation(product: String, ratePlan: String, amount: Option[BigDecimal])

object ProductInformation {
  import io.circe.generic.semiauto.deriveCodec

  implicit val codec = deriveCodec[ProductInformation]
}
