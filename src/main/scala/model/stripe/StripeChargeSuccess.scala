package model.stripe

import com.stripe.model.Charge
import io.circe.generic.JsonCodec

// Represents a successful Stripe charge.
// Includes all fields of the interest to the client.
@JsonCodec case class StripeChargeSuccess private (email: Option[String])

object StripeChargeSuccess {
  def fromStripeCharge(charge: Charge): StripeChargeSuccess =
    StripeChargeSuccess(Option(charge.getReceiptEmail))
}
