package com.gu.stripe

import io.circe.Decoder

// https://stripe.com/docs/api/payment_methods/object#payment_method_object-card-brand
// https://stripe.com/docs/api/customers/object#customer_object-sources-data-brand
// See CreditCardType at https://www.zuora.com/developer/api-reference/#operation/Object_POSTPaymentMethod
sealed abstract class StripeBrand(
    val customerValue: String,
    val paymentMethodValue: String,
    val zuoraCreditCardType: Option[String],
)
object StripeBrand {

  // American Express, Diners Club, Discover, JCB, MasterCard, UnionPay, Visa, or Unknown
  case object Amex extends StripeBrand("American Express", "amex", Some("AmericanExpress"))
  case object Diners extends StripeBrand("Diners Club", "diners", Some("Diners"))
  case object Discover extends StripeBrand("Discover", "discover", Some("Discover"))
  case object Jcb extends StripeBrand("JCB", "jcb", Some("JCB"))
  case object Mastercard extends StripeBrand("MasterCard", "mastercard", Some("MasterCard"))
  case object Unionpay extends StripeBrand("UnionPay", "unionpay", None)
  case object Visa extends StripeBrand("Visa", "visa", Some("Visa"))
  case object Unknown extends StripeBrand("Unknown", "unknown", None)

  val all = Seq(Amex, Diners, Discover, Jcb, Mastercard, Unionpay, Visa, Unknown)

  def decoder(field: StripeBrand => String): Decoder[StripeBrand] = Decoder.decodeString.emap { str =>
    all.find(field(_) == str).toRight("StripeBrand")
  }
}
