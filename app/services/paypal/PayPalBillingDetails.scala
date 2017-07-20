package services.paypal

import codecs.Codec
import codecs.CirceDecoders.deriveCodec

case class PayPalBillingDetails(amount: Float, billingPeriod: String, currency: String)

object PayPalBillingDetails {
  implicit val codec: Codec[PayPalBillingDetails] = deriveCodec
}