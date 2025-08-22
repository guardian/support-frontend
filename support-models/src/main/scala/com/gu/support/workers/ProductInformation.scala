package com.gu.support.workers

case class DeliveryContact(
    firstName: String,
    lastName: String,
    workEmail: String,
    country: String,
    state: Option[String],
    city: String,
    address1: String,
    address2: Option[String],
    postalCode: String,
)

object DeliveryContact {
  import io.circe.generic.semiauto.deriveCodec

  implicit val codec = deriveCodec[DeliveryContact]
}

case class ProductInformation(
    product: String,
    ratePlan: String,
    amount: Option[BigDecimal],
    deliveryAgent: Option[BigDecimal],
    deliveryInstructions: Option[String],
    deliveryContact: Option[DeliveryContact],
    firstDeliveryDate: Option[String],
)

object ProductInformation {
  import io.circe.generic.semiauto.deriveCodec

  implicit val codec = deriveCodec[ProductInformation]
}
