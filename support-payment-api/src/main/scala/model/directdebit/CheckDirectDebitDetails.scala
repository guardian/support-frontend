package model.directdebit

import io.circe.generic.JsonCodec

@JsonCodec case class CheckDirectDebitDetailsData(
    accountNumber: String,
    sortCode: String,
)

@JsonCodec case class CheckDirectDebitDetailsResponse(
    accountValid: Boolean,
    goCardlessStatusCode: Option[Int], // this allows the consumer to understand things like rate limiting (code: 429)
)

object CheckDirectDebitDetailsResponse {

  def apply(accountValid: Boolean): CheckDirectDebitDetailsResponse =
    new CheckDirectDebitDetailsResponse(accountValid, None)

}
