package com.gu.stripe

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

import scala.concurrent.Future

case class CheckoutPaymentMethod(id: String)
object CheckoutPaymentMethod {
  implicit val decoder: Decoder[CheckoutPaymentMethod] = deriveDecoder
}

case class CheckoutSetupIntent(id: String, payment_method: CheckoutPaymentMethod)
object CheckoutSetupIntent {
  implicit val decoder: Decoder[CheckoutSetupIntent] = deriveDecoder
}

case class RetrieveCheckoutSessionResponseSuccess(setup_intent: CheckoutSetupIntent)
object RetrieveCheckoutSessionResponseSuccess {
  implicit val decoder: Decoder[RetrieveCheckoutSessionResponseSuccess] = deriveDecoder
}

object retrieveCheckoutSession {
  def apply(
      stripeService: StripeServiceForAccount,
  )(checkoutSessionId: String): Future[RetrieveCheckoutSessionResponseSuccess] = {
    stripeService.get[RetrieveCheckoutSessionResponseSuccess](
      s"checkout/sessions/$checkoutSessionId?expand[]=setup_intent.payment_method",
    )
  }
}
