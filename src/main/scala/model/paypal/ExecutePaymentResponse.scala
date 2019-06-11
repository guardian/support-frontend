package model.paypal

import io.circe.generic.JsonCodec
import services.IdentityClient.UserSignInDetailsResponse.UserSignInDetails

@JsonCodec case class ExecutePaymentResponse(email: Option[String], guestAccountCreationToken: Option[String], userSignInDetails: Option[UserSignInDetails])

