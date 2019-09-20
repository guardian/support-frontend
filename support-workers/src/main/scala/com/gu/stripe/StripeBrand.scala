package com.gu.stripe

import io.circe.Decoder

// https://stripe.com/docs/api/payment_methods/object#payment_method_object-card-brand
// See CreditCardType at https://www.zuora.com/developer/api-reference/#operation/Object_POSTPaymentMethod
sealed abstract class StripeBrand(val value: String, val zuoraCreditCardType: Option[String])
object StripeBrand {

  case object Amex extends StripeBrand("amex", Some("AmericanExpress"))
  case object Diners extends StripeBrand("diners", Some("Diners"))
  case object Discover extends StripeBrand("discover", Some("Discover"))
  case object Jcb extends StripeBrand("jcb", Some("JCB"))
  case object Mastercard extends StripeBrand("mastercard", Some("MasterCard"))
  case object Unionpay extends StripeBrand("unionpay",  None)
  case object Visa extends StripeBrand("visa", Some("Visa"))
  case object Unknown extends StripeBrand("unknown", None)

  val all = Seq(Amex, Diners, Discover, Jcb,Mastercard,Unionpay,Visa,Unknown)
  def apply(value: String): Option[StripeBrand] = all.find(_.value == value)

  implicit val decoder: Decoder[StripeBrand] = Decoder.decodeString.emap { str =>
    apply(str).toRight("StripeBrand")
  }
}
