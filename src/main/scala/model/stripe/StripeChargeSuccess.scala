package model.stripe

import com.stripe.model.Charge
import io.circe.generic.JsonCodec

@JsonCodec case class StripeChargeSuccess private (currency: String, amount: Long)

object StripeChargeSuccess {
  def fromCharge(charge: Charge): StripeChargeSuccess =
    StripeChargeSuccess(charge.getCurrency, charge.getAmount / 100)
}
