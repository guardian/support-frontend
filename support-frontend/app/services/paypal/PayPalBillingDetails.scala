package services.paypal

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

import com.gu.i18n.Currency

case class PayPalBillingDetails(
    amount: Float,
    billingPeriod: String,
    currency: Currency,
    requireShippingAddress: Boolean,
)

object PayPalBillingDetails {
  import com.gu.support.encoding.CustomCodecs.{encodeCurrency, decodeCurrency}
  implicit val codec: Codec[PayPalBillingDetails] = deriveCodec
}
