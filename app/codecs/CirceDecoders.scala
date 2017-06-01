package codecs

import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.workers.model.{PayPalPaymentFields, StripePaymentFields}
import io.circe.Decoder
import cats.implicits._
import io.circe.generic.auto._

object CirceDecoders {
  type PaymentFields = Either[StripePaymentFields, PayPalPaymentFields]

  implicit val decodeCurrency: Decoder[Currency] =
    Decoder.decodeString.emap { code => Currency.fromString(code).toRight(s"Unrecognised currency code '$code'") }

  implicit val decodeCountry: Decoder[Country] =
    Decoder.decodeString.emap { code => CountryGroup.countryByCode(code).toRight(s"Unrecognised country code '$code'") }

  implicit val paymentFields: Decoder[PaymentFields] = {
    val stripeFields = Decoder[StripePaymentFields].map(_.asLeft[PayPalPaymentFields])
    val payPalFields = Decoder[PayPalPaymentFields].map(_.asRight[StripePaymentFields])
    stripeFields or payPalFields
  }
}
