package model.stripe

import com.stripe.model.Charge
import io.circe.generic.JsonCodec

@JsonCodec case class StripeCreateChargeResponse private (currency: String, amount: BigDecimal)

object StripeCreateChargeResponse {
  def fromCharge(charge: Charge): StripeCreateChargeResponse =
    StripeCreateChargeResponse(
      charge.getCurrency,
      BigDecimal(charge.getAmount) / 100,
    )
}
