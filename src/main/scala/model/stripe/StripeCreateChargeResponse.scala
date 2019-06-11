package model.stripe

import com.stripe.model.Charge
import io.circe.generic.JsonCodec
import services.IdentityClient.UserSignInDetailsResponse.UserSignInDetails

@JsonCodec case class StripeCreateChargeResponse private (currency: String, amount: BigDecimal, guestAccountCreationToken: Option[String], userSignInDetails: Option[UserSignInDetails])

object StripeCreateChargeResponse {
  def fromCharge(charge: Charge, guestAccountCreationToken: Option[String], userSignInDetails: Option[UserSignInDetails]): StripeCreateChargeResponse =
    StripeCreateChargeResponse(
      charge.getCurrency,
      BigDecimal(charge.getAmount) / 100,
      guestAccountCreationToken,
      userSignInDetails
    )
}
