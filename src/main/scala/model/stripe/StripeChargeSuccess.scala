package model.stripe

import com.stripe.model.Charge
import io.circe.generic.JsonCodec

// TODO: currency type
@JsonCodec case class StripeChargeSuccess private (currency: String, amount: Long)

object StripeChargeSuccess {
  def fromStripeCharge(charge: Charge): StripeChargeSuccess =
    StripeChargeSuccess(charge.getCurrency, charge.getAmount)
}
