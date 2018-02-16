package model.stripe

import com.stripe.model.Charge
import io.circe.generic.JsonCodec

// Represents a successful Stripe charge.
// Includes all fields of the interest to the client.
// TODO: created and identityId fields
@JsonCodec case class StripeChargeSuccess private (email: String, currency: String, amount: Long)

object StripeChargeSuccess {
  def fromStripeCharge(charge: Charge): StripeChargeSuccess =
    StripeChargeSuccess(
      email = charge.getReceiptEmail,
      currency = charge.getCurrency,
      amount = charge.getAmount
    )
}
