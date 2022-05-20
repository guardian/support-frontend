package com.gu.patrons.model

import io.circe.Decoder
import io.circe.generic.extras.{Configuration, ConfiguredJsonCodec}
import io.circe.generic.semiauto.deriveDecoder

@ConfiguredJsonCodec
case class StripeSubscription(id: String, customer: StripeCustomer, status: String)

@ConfiguredJsonCodec
case class StripeCustomer(id: String, name: Option[String], email: String)

@ConfiguredJsonCodec
case class StripeSubscriptionsResponse(data: List[StripeSubscription], hasMore: Boolean)

//See docs here: https://stripe.com/docs/api/curl#errors
case class StripeError(
    `type`: String, // The type of error: api_connection_error, api_error, authentication_error, card_error, invalid_request_error, or rate_limit_error
    message: String, // A human-readable message providing more details about the error. For card errors, these messages can be shown to your users.
    code: Option[String] =
      None, // For card errors, a short string from amongst those listed on the right describing the kind of card error that occurred.
    decline_code: Option[String] =
      None, // For card errors resulting from a bank decline, a short string indicating the bank's reason for the decline.
    param: Option[String] = None, // The parameter the error relates to if the error is parameter-specific..
) extends Throwable {

  override def getMessage: String =
    s"message: $message; type: ${`type`}; code: ${code
        .getOrElse("")}; decline_code: ${decline_code.getOrElse("")}; param: ${param.getOrElse("")}"

}

object StripeSubscription {
  implicit val customConfig: Configuration = Configuration.default.withSnakeCaseMemberNames
}

object StripeCustomer {
  implicit val customConfig: Configuration = Configuration.default.withSnakeCaseMemberNames
}

object StripeSubscriptionsResponse {
  implicit val customConfig: Configuration = Configuration.default.withSnakeCaseMemberNames
}

object StripeError {
  implicit val decoder: Decoder[StripeError] = deriveDecoder[StripeError].prepare { _.downField("error") }
}
