package services.paypal

import codecs.Codec
import codecs.CirceDecoders.deriveCodec
import com.gu.i18n.Currency

case class PayPalBillingDetails(amount: Float, billingPeriod: String, currency: Currency)

object PayPalBillingDetails {
  import codecs.CirceDecoders.{encodeCurrency, decodeCurrency}
  implicit val codec: Codec[PayPalBillingDetails] = deriveCodec
}