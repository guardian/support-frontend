package model.stripe

import com.stripe.model.Charge
import io.circe.generic.JsonCodec

@JsonCodec case class StripeCreateChargeResponse private (
    currency: String,
    amount: BigDecimal,
    userType: Option[String],
)

object StripeCreateChargeResponse {
  def fromCharge(charge: Charge, userType: Option[String]): StripeCreateChargeResponse =
    StripeCreateChargeResponse(
      charge.getCurrency,
      BigDecimal(charge.getAmount) / 100,
      userType,
    )
}
