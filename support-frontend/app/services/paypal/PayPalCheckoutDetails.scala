package services.paypal

case class PayPalUserDetails(
    firstName: String,
    lastName: String,
    email: String,
    shipToStreet: String,
    shipToCity: String,
    shipToState: Option[String],
    shipToZip: String,
    shipToCountryCode: String,
)

case class PayPalCheckoutDetails(
    baid: String,
    user: Option[PayPalUserDetails],
)

import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder

object PayPalUserDetails {
  implicit val encoder: Encoder[PayPalUserDetails] = deriveEncoder
}

object PayPalCheckoutDetails {
  implicit val encoder: Encoder[PayPalCheckoutDetails] = deriveEncoder
}
