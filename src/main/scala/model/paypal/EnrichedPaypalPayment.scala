package model.paypal

import com.paypal.api.payments.Payment
import services.IdentityClient.UserSignInDetailsResponse.UserSignInDetails

case class EnrichedPaypalPayment(payment: Payment, email: Option[String], guestAccountCreationToken: Option[String], signInDetails: Option[UserSignInDetails])
