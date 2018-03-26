package model.stripe

import com.stripe.model.Charge
import io.circe.generic.JsonCodec

@JsonCodec case class StripeChargeSuccess private (currency: String, amount: BigDecimal)

object StripeChargeSuccess {
  def fromCharge(charge: Charge): StripeChargeSuccess =
    StripeChargeSuccess(charge.getCurrency, BigDecimal(charge.getAmount) / 100)
}
