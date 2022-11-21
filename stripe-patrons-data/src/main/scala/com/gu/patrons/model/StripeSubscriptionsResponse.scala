package com.gu.patrons.model

import io.circe.Decoder
import io.circe.generic.extras.{Configuration, ConfiguredJsonCodec}

import java.time.{Instant, LocalDate, LocalDateTime, ZoneId}
@ConfiguredJsonCodec
case class StripeSubscription(
    id: String,
    created: LocalDate,
    currentPeriodEnd: LocalDate,
    customer: StripeCustomer,
    status: String,
)

@ConfiguredJsonCodec
case class StripeCustomer(id: String, name: Option[String], email: String, metadata: Metadata) {
  val jointPatronEmail = metadata.jointPatronEmail
  val jointPatronName = metadata.jointPatronName
}

@ConfiguredJsonCodec
case class Metadata(jointPatronEmail: Option[String], jointPatronName: Option[String])
@ConfiguredJsonCodec
case class StripeSubscriptionsResponse(data: List[StripeSubscription], hasMore: Boolean)

@ConfiguredJsonCodec
case class StripeError(
    `type`: String, // The type of error: api_connection_error, api_error, authentication_error, card_error, invalid_request_error, or rate_limit_error
    message: String, // A human-readable message providing more details about the error. For card errors, these messages can be shown to your users.
    code: Option[String] =
      None, // For card errors, a short string from amongst those listed on the right describing the kind of card error that occurred.
    declineCode: Option[String] =
      None, // For card errors resulting from a bank decline, a short string indicating the bank's reason for the decline.
    param: Option[String] = None, // The parameter the error relates to if the error is parameter-specific..
) extends Throwable {

  override def getMessage: String =
    s"message: $message; type: ${`type`}; code: ${code
        .getOrElse("")}; decline_code: ${declineCode.getOrElse("")}; param: ${param.getOrElse("")}"

}

object StripeSubscription {
  implicit val dateDecoder: Decoder[LocalDate] =
    Decoder.decodeInt.map(int =>
      LocalDateTime.ofInstant(Instant.ofEpochSecond(int), ZoneId.systemDefault()).toLocalDate,
    )
  implicit val customConfig: Configuration = Configuration.default.withSnakeCaseMemberNames
}

object Metadata {
  implicit val customConfig: Configuration = Configuration.default.withSnakeCaseMemberNames
}
object StripeCustomer {
  implicit val customConfig: Configuration = Configuration.default.withSnakeCaseMemberNames
}

object StripeSubscriptionsResponse {
  implicit val customConfig: Configuration = Configuration.default.withSnakeCaseMemberNames
}

object StripeError {
  implicit val customConfig: Configuration = Configuration.default.withSnakeCaseMemberNames
}
