package com.gu.stripe

import com.gu.support.workers.PaymentMethodId
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

import scala.concurrent.Future

object getPaymentMethod {

  case class StripePaymentMethod(
      card: StripeCard,
  )
  implicit val decoder = deriveDecoder[StripePaymentMethod]

  object StripeCard {

    implicit val brandDecoder = StripeBrand.decoder(_.paymentMethodValue)
    implicit val decoder: Decoder[StripeCard] = deriveDecoder

  }

  case class StripeCard(brand: StripeBrand, last4: String, exp_month: Int, exp_year: Int, country: String)

  def apply(stripeService: StripeServiceForCurrency)(paymentMethod: PaymentMethodId): Future[StripePaymentMethod] =
    stripeService.get[StripePaymentMethod](s"payment_methods/${paymentMethod.value}")

}
